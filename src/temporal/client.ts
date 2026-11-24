import { Connection } from "@temporalio/client";
import { TEMPORAL_ADDRESS, TEMPORAL_TASK_QUEUE } from "../config/env";
import { getTemporalClient } from "../config/temporal";
import { RegenerateSlotsInput } from "../services/slot.service";



export const temporalEnabled = async (
    address = TEMPORAL_ADDRESS,
    timeoutMs = 3000,
): Promise<Boolean> => {
    let connection: Connection | undefined;

    try {
        connection = await Connection.connect({
            address,
            connectTimeout: timeoutMs,
        });
        const info = await connection.workflowService.getSystemInfo({});

        return true
    } catch (error) {
       return false;
    } finally {
        await connection?.close();
    }
};

export const startWorkflow = async (
    workflowName: string,
    workflowId: string,
    args: unknown[],
) => {
    const status = await temporalEnabled();
    if(!status){
        console.warn('[Temporal] Temporal is not enabled');
        return null;
    }

    try {
        const client = await Promise.race([
            getTemporalClient(),
            new Promise<never>((_, reject)=> setTimeout(()=>reject(new Error('Temporal client connection timeout')), 5000)),
        ]);
        
        const handle = await client.workflow.start(workflowName, {
            workflowId,
            taskQueue: TEMPORAL_TASK_QUEUE,
            args,
        });

        return handle.workflowId;
    } catch (error) {
        console.error(`[Temporal] Error in starting workflow: ${workflowName} with id ${workflowId}, error: ${error}`);
        return null;
    }
};

export const regenerateHostSlotsWorkflow = (input: RegenerateSlotsInput)=>{
    return startWorkflow(
        'regenerateHostSlotsWorkflow',
        `regenerate-host-slots-${input.hostId}-${Date.now()}`,
        [input],
    )
}