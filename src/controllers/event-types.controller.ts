import { Request, Response } from "express";
import { createEventTypes, 
    deleteEventType,
    updateEventType,
    getEventTypeById,
    listAllEventTypes,
    getEventTypeByIdPublic} from "../services/event-type.service";
import { createEventTypeDto } from "../dtos/event-type.dto";
import { sendSuccess } from "../utils/api-response";

export const create = async(req: Request, res: Response)=>{
    const data: createEventTypeDto = req.body;
    const eventType = await createEventTypes(req.userId, data);
    sendSuccess(res, eventType, "Event created successfully");
}

export const remove = async(req: Request, res: Response)=>{
    const {eventTypeId} = req.params;
    await deleteEventType(req.userId, Number(eventTypeId));
    sendSuccess(res, "EventType deleted successfully");
}

export const update = async(req: Request, res: Response)=>{
    const {eventTypeId} = req.params;
    const eventType = await updateEventType(req.userId, Number(eventTypeId), req.body);
    sendSuccess(res, eventType, "Event updated successfully");
}

export const getById = async(req: Request, res: Response)=>{
    const {eventTypeId} = req.params;
    const eventType = await getEventTypeById(req.userId, Number(eventTypeId));
    sendSuccess(res, eventType, "Event details fetched successfully");
}

export const getAll= async(req: Request, res: Response)=>{
    const allEventTypes = listAllEventTypes(req.userId);
    sendSuccess(res, allEventTypes, "fetched allEventTypes");
}

export const getByIDPublic = async(req: Request, res: Response)=>{
    const {slug} = req.params;
    const eventType = getEventTypeByIdPublic(req.userId, String(slug));
}
