import {date, z} from 'zod';

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export enum availabilityType{
    "BLOCK_FULL_DAY",
    "BLOCK_PARTIAL",
    "ADD_AVAILABLE_WINDOW"
}

const createAvailabilityRuleBaseSchema = z.object({
    weekday: z.number().int().min(0).max(6),
    startTime: z.string().regex(timeRegex, 'Start time is requried'),
    endTime: z.string().regex(timeRegex, 'End time is requried'),
    isActive: z.boolean().default(true),
    timeZone: z.string().default('IST'),
});

export const createAvailabilityRuleSchema = createAvailabilityRuleBaseSchema.refine(
    (rule)=> rule.startTime < rule.endTime,
    {message: "Start time must be before end time"},
);

export const updateAvailabilityRuleSchema = createAvailabilityRuleBaseSchema.partial();

const createAvailabilityExceptionBaseSchema = z.object({
    date: z.string().regex(dateRegex, 'Date is requried'),
    type: z.enum(availabilityType, 'type is requried'),
    startTime: z.string().regex(dateRegex, 'Start time is requried'),
    endTime: z.string().regex(dateRegex, 'End time is requried'),
    message: z.string().optional(),
    timeZone: z.string().default('IST'), 
})

export const createAvailabilityExceptionSchema = createAvailabilityExceptionBaseSchema.superRefine((data, ctx)=>{
    if(data.type !== availabilityType.BLOCK_FULL_DAY){
        if(!data.startTime){
            ctx.addIssue({path: ['startTime'], code:'custom', message:"Start time is required"});
        }
        if(!data.endTime){
            ctx.addIssue({path:['endTime'], code:'custom', message:"End time is required"});
        }
        if(data.startTime && data.endTime && data.startTime >= data.endTime){
            ctx.addIssue({path:['endTime'], code:'custom', message:"End time must be after start time"});
        }
    }
})

export const updateAvailabilityExceptionRuleSchema = createAvailabilityExceptionBaseSchema.partial();

export type CreateAvailabilityRuleSchemaDTO = z.infer<typeof createAvailabilityRuleSchema>;
export type UpdateAvailabilityRuleSchemaDTO = z.infer<typeof updateAvailabilityRuleSchema>;
export type CreateAvailabilityExceptionSchemaDTO = z.infer<typeof createAvailabilityExceptionSchema>;
export type UpdateAvailabilityExceptionRuleSchemaDTO = z.infer<typeof updateAvailabilityExceptionRuleSchema>;
