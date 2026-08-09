import {z} from 'zod';

export const createEventTypeSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1).max(1000).optional(),
    slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    durationMinutes: z.number().min(10).max(120).default(30),
    isActive: z.boolean().default(true),
    locationType: z.enum(['online','in-person']).default('online'),
    locationValue: z.string().default(''),
    bufferBeforeMinutes: z.number().default(0),
    bufferAfterMinutes: z.number().default(0),
});

export const updateEventTypeSchema = createEventTypeSchema.partial();

export type createEventTypeDto = z.infer<typeof createEventTypeSchema>;
export type updateEventTypeDto = z.infer<typeof updateEventTypeSchema>;