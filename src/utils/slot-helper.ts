import { DateTime ,Interval} from "luxon";

export interface TimeWindow{
    start: DateTime;
    end: DateTime;
}

export const splitSlots = (windows: TimeWindow[], slotDuration: number, beforeBuffer: number, afterBuffer: number)=>{
    if(windows.length === 0)return [];
    const totalDuration = slotDuration + beforeBuffer + afterBuffer;

    const slots: TimeWindow[] = [];
    
    for(const window of windows){
        let cursor = window.start;
        
        while(cursor.plus({minute:totalDuration}) <= window.end){
            const newSlotStart = cursor.plus({minute: beforeBuffer});
            const newSlotEnd = cursor.plus({minute: afterBuffer});
            slots.push({start: newSlotStart, end: newSlotEnd});
            cursor = cursor.plus({minute: slotDuration})
        }
    }
    return slots;
}

export const parseDateOnTime = (date: DateTime, time: string, timeZone: string) =>{
    const [hour, minute] = time.split(":").map(Number);
    return date.setZone(timeZone).set({
        hour,
        minute,
        second: 0,
        millisecond:0,
    })
}

export const mergeIntervals = (windows: TimeWindow[]) : TimeWindow[]=>{
    if(windows.length == 0)return [];
    const sorted = [...windows].sort((a,b)=> a.start.toMillis() - b.start.toMillis());

    const mergedWindows: TimeWindow[] = [sorted[0]];
    
    for(let index = 1; index < sorted.length; index++){
        const currentWindow = sorted[index];
        const lastWindow = mergedWindows[mergedWindows.length - 1];

        if(currentWindow.start <= lastWindow.end){
            lastWindow.end = DateTime.max(lastWindow.end, currentWindow.end);
        }else{
            mergedWindows.push(currentWindow);
        }
    }
    return mergedWindows;
}

export const removeInvalidSlots = (windows: TimeWindow[], block: TimeWindow)=>{
    //filters window based on block
    //returns only valid blocks
    //works when user explicitly add "Not avialable from xx:xx to yy:yy"

    const result: TimeWindow[] = [];
    
    for(let window of windows){
        const availabilityInterval = Interval.fromDateTimes(window.start, window.end);
        const blockedInterval = Interval.fromDateTimes(block.start, block.end);
        if(!availabilityInterval.overlaps(blockedInterval)){
            result.push(window);
            return result;
        };

        //partial overlap

        if(window.start < block.end){
            result.push({start: window.start, end: block.start})
        }

        if(window.end > block.end){
            result.push({start: block.end, end: window.end});
        }
    }
    const validWindows = result.filter(w => w.end >= w.start);
    return validWindows;
}

export const isSlotOverlaped = (slot: TimeWindow, bookedSlots: TimeWindow[], bufferBeforeMinutes: number, bufferAfterMinutes: number): Boolean =>{
    
    const paddingStart = slot.start.minus({minutes: bufferBeforeMinutes});
    const paddingEnd = slot.end.plus({minutes: bufferAfterMinutes});
    
    const overlaps = bookedSlots.some(booking=>{
        const slotInterval = Interval.fromDateTimes(paddingStart, paddingEnd);
        const bookingInterval = Interval.fromDateTimes(booking.start, booking.end);
        return slotInterval.overlaps(bookingInterval);
    })
    
    return overlaps;
}

export const applyExceptionForDate = (
    date: DateTime,
    baseWindows: TimeWindow[],
    exceptions: Array<{
        type: "BLOCK_FULL_DAY" | "BLOCK_PARTIAL" | "ADD_AVAILABLE_WINDOW",
        startTime: string | null,
        endTime: string | null,
        timeZone: string,
    }>,
)=>{
    const windows = [...baseWindows];
    for(const ex of exceptions){
        if(ex.type === 'BLOCK_FULL_DAY'){
            return [];
        }
        if(ex.type === 'BLOCK_PARTIAL' &&  ex.startTime && ex.endTime){
            const block = {
                start: parseDateOnTime(date, ex.startTime, ex.timeZone),
                end: parseDateOnTime(date, ex.endTime, ex.timeZone),
            }
            const validWindow = removeInvalidSlots(windows, block);
            return validWindow;
        }
        if(ex.type === 'ADD_AVAILABLE_WINDOW' && ex.startTime && ex.endTime){ //adding custom window
            const block = {
                start: parseDateOnTime(date, ex.startTime, ex.timeZone),
                end: parseDateOnTime(date, ex.endTime, ex.timeZone),
            }
            windows.push(block);
        }
    }
    return mergeIntervals(windows);
}
