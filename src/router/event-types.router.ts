import { Router } from "express";
import { create, remove , getAll, getById, getByIDPublic, update } from "../controllers/event-types.controller";
import { requireUserId } from "../middleware/require-user-id";

export const eventTypesRouter = Router();

eventTypesRouter.use(requireUserId);

eventTypesRouter.post("/", create);
eventTypesRouter.put("/:eventTypeId", update);
eventTypesRouter.get("/:eventTypeId", getById);
eventTypesRouter.get("/", getAll);
eventTypesRouter.get("/:slug", getByIDPublic);
eventTypesRouter.delete("/:eventTypeId", remove);