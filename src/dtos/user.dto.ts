import {z} from 'zod';

export const createUserSchema = z.object({
    email: z.string().email({
        message: "Invalid email address"
    }),
    name: z.string().min(1, 'name is requried').max(20, 'name must be less than 20 characters'),
});

export const findUserSchema = z.object({
    id: z.coerce.number().int().positive("ID must be a positive number"),
})

export const updateUserSchema = z.object({
    name: z.string().min(1, 'name is requried').max(20, 'name must be less than 20 characters').optional(),
    email: z.string().email({
        message: "Invalid email address"
    }).optional(),
}).refine((data)=> data.email !== undefined || data.name !== undefined, {
    message: 'At least one field is requried'
});

export type createUserDto = z.infer<typeof createUserSchema>;
export type findUserDto = z.infer<typeof findUserSchema>;
export type updateUserDto = z.infer<typeof updateUserSchema>;