import {z} from 'zod';

export const createSlotSchema = z.object({
    hostId : z.number(),
    eventTypeId : z.number(),
    startAt : z.date(),
    endAt: z.date(),
    duration: z.number(),
    status: z.enum(["AVAILABLE", "RESERVED", "CANCELLED"])
}) 

export const updateSlotSchema = createSlotSchema.partial();

export type createSlotDto = z.infer<typeof createSlotSchema>;
export type updateSlotDto = z.infer<typeof updateSlotSchema>;