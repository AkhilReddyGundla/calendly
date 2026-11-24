import { RegenerateSlotsInput, regenerateHostSlots as runRegenerateHostSlots } from "../../services/slot.service";


export const regenerateHostSlotsActivity = async(input: RegenerateSlotsInput)=>{
    await runRegenerateHostSlots(input);
}