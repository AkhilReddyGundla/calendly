import { DateTime ,Interval} from "luxon";

export interface TimeWindow{
    start: DateTime;
    end: DateTime;
}

export const splitSlots = (windows: TimeWindow[], slotDuration: number, beforeBuffer: number, afterBuffer: number): TimeWindow[]=>{
    if(windows.length === 0)return [];

    const slots: TimeWindow[] = [];
    const totalMinutes = slotDuration + beforeBuffer + afterBuffer;
    for(const window of windows){
        let cursor = window.start;

        while(cursor.plus({minutes: totalMinutes}) <= window.end){
            const slotStart = cursor.plus({minutes: beforeBuffer});
            const slotEnd = cursor.plus({minutes: afterBuffer});
            slots.push({start: slotStart, end: slotEnd});
            cursor = cursor.plus({minutes: slotDuration});
        }
    }
    return slots;
}

/*
    input :
    date: "2026-01-01"(YYYY-MM-DD)
    time: "10:20"
    timexone: "IST"

    output:
    DateTime = "2026-01-01T10:20:00.000Z" in host time zone

    Given date and time, we will return absolute DateTime object in host's timezone
*/
export const parseDateOnTime = (date: DateTime, time: string, timeZone: string) =>{
    const [hour, minute] = time.split(":").map(Number);
    return date.setZone(timeZone).set({
        hour,
        minute,
        second: 0,
        millisecond:0,
    })
}
// [{09:00, 12:00}, {11:00, 14:00}] => [{09:00, 14:00}]
export const mergeIntervals = (windows: TimeWindow[]) : TimeWindow[]=>{
    const windowLength = windows.length;
    if(windowLength == 0)return [];

    const sortedWindow = [...windows].sort((a: TimeWindow, b: TimeWindow)=>a.start.toMillis() - b.start.toMillis());

    const mergedResult: TimeWindow[] = [sortedWindow[0]];

    for(let index = 1; index < windowLength; index++){
        const currentWindow = sortedWindow[index];
        const lastMergedWindow = mergedResult[mergedResult.length - 1];

        if(currentWindow.start <= lastMergedWindow.end){
            lastMergedWindow.end = DateTime.max(lastMergedWindow.end, currentWindow.end);
        }else{
            mergedResult.push(currentWindow);
        }
    }
    return mergedResult;
}

export const removeInvalidWindow = (windows: TimeWindow[], block: TimeWindow)=>{
    //filters window based on block
    //returns only valid blocks
    //works when user explicitly add "Not avialable from xx:xx to yy:yy"

    const result: TimeWindow[] = [];
    const blockedInterval = Interval.fromDateTimes(block.start, block.end);
    
    for(let window of windows){
        const availabilityInterval = Interval.fromDateTimes(window.start, window.end);
        if(!availabilityInterval.overlaps(blockedInterval)){
            result.push(window);
            continue;
        };

        //partial overlap

        if(block.start > window.start){
            result.push({start: window.start, end: block.start});
        }

        if(block.end < window.end){
            result.push({start: block.end, end: window.end});
        }
    }
    const validWindows = result.filter(w => w.end >= w.start);
    return validWindows;
}

export const isSlotOverlaped = (slot: TimeWindow, bookedSlots: TimeWindow[], bufferBeforeMinutes: number, bufferAfterMinutes: number): Boolean =>{
    
    const paddedStart = slot.start.minus({minutes: bufferBeforeMinutes});
    const paddedEnd = slot.end.plus({minutes: bufferAfterMinutes});
    
    const overlaps = bookedSlots.some(booking=>{
        const slotInterval = Interval.fromDateTimes(paddedStart, paddedEnd);
        const bookingInterval = Interval.fromDateTimes(booking.start, booking.end);
        return slotInterval.overlaps(bookingInterval);
    })
    
    return overlaps; // return true or false
}

export enum ExceptionType{
    "BLOCK_FULL_DAY" ,
    "BLOCK_PARTIAL",
    "ADD_AVAILABLE_WINDOW",
}

export const applyExceptionForDate = (
    date: DateTime,
    baseWindows: TimeWindow[],
    exceptions: Array<{
        type: ExceptionType | string, // it should not be
        startTime: string | null,
        endTime: string | null,
        timeZone: string,
    }>,
)=>{
    // returns valid window
    let windows = [...baseWindows];
    for(const ex of exceptions){
        if(ex.type === ExceptionType.BLOCK_FULL_DAY){
            return []; // no slots
        }
        if(ex.type === ExceptionType.BLOCK_PARTIAL &&  ex.startTime && ex.endTime){
            const block = {
                start: parseDateOnTime(date, ex.startTime, ex.timeZone),
                end: parseDateOnTime(date, ex.endTime, ex.timeZone),
            }
            windows = removeInvalidWindow(windows, block);
        }
        if(ex.type === ExceptionType.ADD_AVAILABLE_WINDOW && ex.startTime && ex.endTime){ //adding custom window (extra window)
            const block = {
                start: parseDateOnTime(date, ex.startTime, ex.timeZone),
                end: parseDateOnTime(date, ex.endTime, ex.timeZone),
            }
            windows.push(block);
        }
    }
    return mergeIntervals(windows);
}



export const windowsForWeekDayRules = (date: DateTime, startTime: string, endTime: string, weekDay:number, timeZone:string )=>{ // checks whether the passed date fall in weekday (ex: user only avaiable on mondays, it checks wheter passed date is monday or not)
    const localDate = date.setZone(timeZone).startOf('day');
    const luxonWeekday = weekDay === 0 ? 7 : weekDay;// luxon compatable

    if(localDate.weekday !== luxonWeekday)return [];// host is not available on that day

    const start = parseDateOnTime(date, startTime, timeZone);
    const end = parseDateOnTime(date, endTime, timeZone);

    if(!start.isValid || !end.isValid || start >= end)return [];

    return [{start, end}];
}