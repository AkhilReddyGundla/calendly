import { proxyActivities } from "@temporalio/workflow";

import type * as activities from '../activities/index.ts'
import { RegenerateSlotsInput } from "../../services/slot.service.js";


export const activityHandle = proxyActivities<typeof activities>({
    startToCloseTimeout: '3 minutes',
    retry: {maximumAttempts: 3},
});

export const {regenerateHostSlotsActivity} = activityHandle;

export const regenerateHostSlotsWorkflow = async(input: RegenerateSlotsInput)=>{
    await regenerateHostSlotsActivity(input);
}