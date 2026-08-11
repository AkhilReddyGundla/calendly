import slugify from "slug";
import { createEventTypeDto, updateEventTypeDto } from "../dtos/event-type.dto";
import { create, listEventType as hostEventTypes, findByHostIdAndSlug, getByEventTypeIDAndHost, isSlugAvailable, remove, update } from "../repositories/event-types.repositry";
import { conflict, forbidden, notFound } from "../utils/api-error";
import { nanoid } from "nanoid";
import { getById as getUserById, } from "../repositories/user.repositry";

export const createEventTypes = async(hostId: number, data: createEventTypeDto)=>{
    const baseSlug = data.slug 
    ? slugify(data.slug, {lower: true})
    : slugify(data.title, {lower: true});

    if(!baseSlug){
        throw conflict("Unable to generate slug for eventType");
    }

    const available = await isSlugAvailable(hostId, baseSlug);

    const finalSlug = available ? baseSlug : `${baseSlug}-${nanoid(4)}`;
    
    const eventType = await create(hostId, {...data, slug: finalSlug});
    return eventType;
}

export const deleteEventType = async(hostId: number, eventTypeId: number)=>{
    const deletedCount = await remove(hostId, eventTypeId);
    if(deletedCount === 0){
        throw notFound("EventType not found");
    }
    return {success: true};
}

export const updateEventType = async(hostId: number, eventTypeId: number, data: updateEventTypeDto)=>{
    const eventType = await getByEventTypeIDAndHost(hostId, eventTypeId);
    if(!eventType){
        throw notFound("EventType not found");
    }
   
    if(data.slug && data.slug !== eventType.slug){
        const isSlugTaken = await isSlugAvailable(hostId, data.slug);
        if(isSlugTaken){
            throw conflict("A event-type with slug already exists");
        }
    }
    const updatedEventType = update(hostId, eventTypeId, data);
    return updatedEventType;
}

export const listAllEventTypes = async(hostId: number)=>{
    const eventTypes = await hostEventTypes(hostId);
    return eventTypes;
}

export const getEventTypeById = async(hostId: number, eventId: number)=>{
    const eventType = await getByEventTypeIDAndHost(hostId, eventId);
    if(!eventType){
        throw notFound("EventType not found");
    }

    return eventType;
}

export const getEventTypeByIdPublic = async(hostId: number, slug: string)=>{
    const eventType = await findByHostIdAndSlug(hostId, slug);
    if(!eventType){
        throw notFound("EventType not found");
    }
    const host = await getUserById(hostId);
    if(!host){
        throw notFound("Host is not found");
    }
    const publicEventType = {
        title: eventType.title,
        description: eventType.description,
        durationInMinutes: eventType.durationMinutes,
        isActive: eventType.isActive,
        locationType: eventType.locationType,
    }
    const hostDetails = {
        name: host.name,
        createdAt: host.createdAt,
    }
    return {publicEventType, hostDetails};
}