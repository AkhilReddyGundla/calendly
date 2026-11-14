import { DateTime } from "luxon";
import { getById } from "../repositories/user.repositry"
import { slotGenerationDates } from "../config/env";
import { findExceptionsInRange, listActiveRulesByUser, listExceptionsByUser } from "../repositories/availability.repositry";
import { getAllActiveEventsTypes } from "../repositories/event-types.repositry";
import { cancelSlotsByIds, getBookedSlotsForHostInRange, getFutureSlots, SlotUpsertData, upsertAvailableSlots } from "../repositories/slot.resositry";
import { applyExceptionForDate, isSlotOverlaped, splitSlots, TimeWindow, windowsForWeekDayRules } from "../utils/slot-helper";
import { prisma } from "../config/database";

export interface RegenerateSlots{
    hostId: number,
    from?: string, // start date YYYY-MM-DD
    to?: string,    // end date YYYY-MM-DD
}

export const regenerateHostSlots = async(input: RegenerateSlots)=>{
    const host = await getById(input.hostId);
    if(!host)return;

    const from = input.from ? DateTime.fromISO(input.from, {zone: host.timeZone}).startOf('day') 
                            : DateTime.now().startOf('day');
    const to = input.to? DateTime.fromISO(input.to, {zone: host.timeZone})
                            : from.plus({days: slotGenerationDates}).endOf('day');

                    
    const [rules, exceptions, eventTypes, bookedSlots] = await Promise.all([
        listActiveRulesByUser(input.hostId),
        findExceptionsInRange(input.hostId, from.toJSDate(), to.toJSDate()),
        getAllActiveEventsTypes(input.hostId),
        getBookedSlotsForHostInRange(input.hostId, from.toJSDate(), to.toJSDate()),
    ])
    
    //booked slots into time windows which are compatable with luxon
    const bookedWindows: TimeWindow[] = bookedSlots.map((slot)=>{
        return {
            start: DateTime.fromJSDate(slot.startAt, {zone: host?.timeZone}),
            end: DateTime.fromJSDate(slot.endAt, {zone: host.timeZone}),
        }
    });

    for(const eventType of eventTypes){
        for(let pointer = from; pointer<=to; pointer = pointer.plus({days: 1}) ){
            const dateKey = pointer.toISODate();//convert into yyyy-mm-dd
            const currentDayExceptions = exceptions.filter((exception)=> DateTime.fromJSDate(exception.date, {zone: host.timeZone}).toISODate() === dateKey);
            
            const validGeneratedKeys = new Set<string>();
            
            let windows: TimeWindow[] = [];

            for(const rule of rules){
                // get valid windows in particular day
                windows.push(...windowsForWeekDayRules(pointer, rule.startTime, rule.endTime, rule.weekday, rule.timezone)); // convert elemets in availability rule into luxon compatable type
            }

            // need fix here type
            const currentDayExceptionList = currentDayExceptions.map(exception =>({
                type: exception.type,
                startTime: exception.startTime,
                endTime: exception.endTime,
                timeZone: exception.timezone
            }))
            windows = applyExceptionForDate(pointer, windows, currentDayExceptionList);
            

            // generate slots and filter booked slots
            let slots = splitSlots(windows, eventType.durationMinutes, eventType.bufferBeforeMinutes, eventType.bufferAfterMinutes)
                        .filter(slot => slot.start > DateTime.utc() && !isSlotOverlaped(slot, bookedWindows, eventType.bufferBeforeMinutes, eventType.bufferAfterMinutes));



            const slotsData: SlotUpsertData[] = [];

            for(const slot of slots){
                const startAt = slot.start.toUTC().toJSDate();
                const endAt = slot.end.toUTC().toJSDate();
                const duration = slot.end.diff(slot.start, 'minute').minutes;

                const key = `${eventType.id}_${startAt.toISOString()}_${endAt.toISOString()}`;
                validGeneratedKeys.add(key);
                
                slotsData.push({
                    hostId: host.id,
                    eventTypeId: eventType.id,
                    startAt,
                    endAt,
                    duration
                })
            }


            await upsertAvailableSlots(slotsData);
           

            const futureSlots = await getFutureSlots(eventType.id, from, to); // all slots in db
            
            // Remove invalid slots
           
            const invalidSlotIds = futureSlots.filter((slot)=>{
                const key = `${eventType.id}_${slot.startAt.getTime()}_${slot.endAt.getTime()}`;
                return !validGeneratedKeys.has(key);
            }).map(slot=>slot.id);

            if(invalidSlotIds.length > 0){
                await cancelSlotsByIds(invalidSlotIds)
            }

        }
    }
  
}