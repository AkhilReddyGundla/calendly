import { Router } from "express";
import { create, remove , getAll, getById, getByIDPublic, update } from "../controllers/event-types.controller";
import { requireUserId } from "../middleware/require-user-id";
import { validate } from "../middleware/validate";
import { createEventTypeSchema, updateEventTypeSchema } from "../dtos/event-type.dto";

export const eventTypesRouter = Router();

eventTypesRouter.use(requireUserId);

eventTypesRouter.post("/", validate(createEventTypeSchema), create);
eventTypesRouter.put("/:eventTypeId",validate(updateEventTypeSchema) ,update);
eventTypesRouter.get("/:eventTypeId", getById);
eventTypesRouter.get("/", getAll);
//eventTypesRouter.get("/:slug", getByIDPublic);
eventTypesRouter.delete("/:eventTypeId", remove);