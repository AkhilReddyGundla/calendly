import {prisma} from "../config/database.js"
import {CreateBookingDTO} from "../dtos/booking.dto.js"
import { badRequest, notFound } from "../utils/api-error.js";


export const createBooking = async(userId: number, dto: CreateBookingDTO)=>{
     const booking = await prisma.$transaction(
        async (tx)=>{
            const slot = await tx.slots.findUnique({
                where:{
                    id: dto.slotId
                }
            });

            if(!slot){
                throw notFound('Slot is not found');
            }

            if(slot.status !== 'AVAILABLE'){
                throw badRequest('Slot is not available');
            }

            if(slot.startAt <= new Date()){
                throw badRequest('Slot is already started');
            }

            const updated = await tx.slots.updateMany({
                where: {
                    id: dto.slotId,
                    status: 'AVAILABLE'
                },
                data:{
                    status: 'RESERVED',
                }
            });

            if(updated.count != 1){
                throw badRequest('Slot is already booked');
            }

            return tx.bookings.create({
                data:{
                    slotId: dto.slotId,
                    inviteeEmail: dto.inviteeEmail,
                    inviteeNotes: dto.inviteeNotes,
                    status: 'SUCCESS',
                    hostId: userId,
                    eventTypeId: slot.eventTypeId,
                    meetLink: 'xyz',
                },
                include:{
                    slot: true
                }
            })
        }
     )

     return{
        booking:{
            id: booking.id,
        }
     }
}

export const createBookingPessimistically = async(userId: number, dto: CreateBookingDTO)=>{
    const booking = await prisma.$transaction(
        async(tx)=>{
            const locked = await tx.$queryRaw<{id: string}[]>`
                SELECT id from slots where id = ${dto.slotId} FOR UPDATE
            `;
            if(locked.length === 0){
                throw notFound('Slot is not found');
            }

            const slot = await tx.slots.findUnique({
                where:{
                    id: dto.slotId
                }
            })

            if(!slot){
                throw notFound('Slot is not found');
            }

            if(slot.status !== 'AVAILABLE'){
                throw badRequest('Slot is not available');
            }

            if(slot.startAt <= new Date()){
                throw badRequest('Slot is already started');
            }

            const updated = await tx.slots.update({
                where: {
                    id: dto.slotId
                },
                data:{
                    status: 'RESERVED',
                }
            });

            return tx.bookings.create({
                data:{
                    slotId: dto.slotId,
                    inviteeEmail: dto.inviteeEmail,
                    status: 'SUCCESS',
                    hostId: userId,
                    eventTypeId: slot.eventTypeId,
                    meetLink: 'xyz',
                }
            })
        }
    )

    return{
        booking:{
            id: booking.id
        }
    }
}