import {z} from "zod";

export const createBookingSchema = z.object({
    slotId : z.string(),
    inviteeName: z.string().min(1, 'Name is requried').max(50, 'Name not more than 50 Characters'),
    inviteeEmail: z.email('Invalid email address'),
    inviteeNotes: z.string().optional(),
});

const dateRegex =/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export const listHostBookingQuerySchema = z.object({
    status: z.enum(['AVAILABLE', 'RESERVED', 'CANCELLED']),
    from: z.string().regex(dateRegex, "from must be in YYYY-MM-DD format").optional(),
    to: z.string().regex(dateRegex, "to must be in YYYY-MM-DD format").optional(),
});

export type CreateBookingDTO = z.infer<typeof createBookingSchema>;
export type ListHostBookingQuerySchema = z.infer<typeof listHostBookingQuerySchema>;