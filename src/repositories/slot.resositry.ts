import { DateTime } from "luxon";
import { prisma } from "../config/database"
import { EventType } from "../generated/prisma";
import { TimeWindow } from "../utils/slot-helper";

export interface SlotUpsertData {
    hostId: number;
    eventTypeId: number;
    startAt: Date;
    endAt: Date;
    duration: number;
  }

export const getBookedSlotsForHostInRange = async(hostId: number, startDate: Date, endDate: Date)=>{
    const bookings = await  prisma.slots.findMany({
        where :{
            hostId,
            startAt : {
                gte : startDate,
                lte: endDate,
            }
        }
    });

    return bookings;
}

export const upsertAvailableSlots = async(slotsData: SlotUpsertData[]) =>{
    if(slotsData.length === 0)return [];

    const operations = slotsData.map((slot) => 
        prisma.slots.upsert({
            where: {
                eventTypeId_startAt_endAt: {
                    eventTypeId: slot.eventTypeId,
                    startAt : slot.startAt,
                    endAt: slot.endAt,
                }
            },

            create: {
                hostId: slot.hostId,
                eventTypeId: slot.eventTypeId,
                startAt: slot.startAt,
                endAt: slot.endAt,
                duration: slot.duration,
            },
            
            update: {
                status: 'AVAILABLE'
            }
        })
    );

    return prisma.$transaction(operations);
}


export const getFutureSlots = async(eventTypeId: number, from: DateTime, to: DateTime)=>{
    const slots = await prisma.slots.findMany({
        where: {
            eventTypeId,
            startAt : {gte: from.toJSDate(), lte: to.toJSDate()},
            status: {in: ['AVAILABLE', 'RESERVED']},
        }
    });

    return slots;
}


export const cancelSlot = async(slotId: string)=>{
    prisma.slots.update({
        where : {
            id: slotId
        },
        data: {
            status : 'CANCELLED',
        }
    });
}


export const cancelSlotsByIds = async(slotIds: string[])=>{
    if(slotIds.length === 0)return 0;

    return prisma.slots.updateMany({
        where: {
            id: {in: slotIds},
            status: 'AVAILABLE',
        },

        data: {
            status: 'CANCELLED',
        }
    });
}