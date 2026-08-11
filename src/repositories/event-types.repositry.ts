// 1. Import your shared prisma instance (adjust the path to your database.ts file)
import { prisma } from "../config/database"; 
import { createEventTypeDto, updateEventTypeDto } from "../dtos/event-type.dto";

// 2. Import the EventType typescript interface from your CUSTOM generated folder
import { EventType } from "../generated/prisma"; 

export const getAllTypes = async (hostId: number, slug: string): Promise<EventType[]> => {
    // 3. Use camelCase for the model name on the prisma object
    const events = await prisma.eventType.findMany({
        where: {
            hostId,
            slug,
        }
    });

    return events as EventType[];
}


export const getByEventTypeIDAndHost = async(hostId:number, eventTypeId: number) =>{
    const eventType = await prisma.eventType.findFirst({
        where:{
            id: eventTypeId,
            hostId,
        },
    });
    return eventType;
}


export const create = async(hostId: number, data: createEventTypeDto & {slug: string})=>{
   
    const eventType = await prisma.eventType.create({
        data:{
            hostId,
            ...data
        }
    })
    return eventType;
}

export const update = async(hostId:number, eventTypeId: number ,data: updateEventTypeDto)=>{ 
    const updatedEventType = await prisma.eventType.update({
        where:{
            id: eventTypeId,
            hostId
        },
        data
    })

    return updatedEventType;
}

export const remove = async(hostId: number, eventTypeId: number)=>{
    const result = await prisma.eventType.deleteMany({
        where: {
            id: eventTypeId,
            hostId
        }
    })
    return result.count;
}

export const findByHostIdAndSlug = async(hostId: number, slug: string)=>{
    const eventType = await prisma.eventType.findFirst({
        where: {
            hostId,
            slug,
        }
    })
    return eventType;
}


export const listEventType = async(hostId: number)=>{
    const eventType = await prisma.eventType.findMany({
        where:{
            hostId,
        }
    })
    return eventType;
}


export const isSlugAvailable = async(hostId: number, slug: string)=>{
    const existingSlug = await prisma.eventType.findFirst({
        where: {
            hostId,
            slug
        }
    })
    return existingSlug != null;
}