import { Router } from "express";
import { validate } from "../middleware/validate";
import { createException, createRule, deleteException, deleteRule, listExceptions, listRules, updateException, updateRule } from "../controllers/availability.controller";
import { requireUserId } from "../middleware/require-user-id";
import { createAvailabilityExceptionSchema, createAvailabilityRuleSchema, updateAvailabilityExceptionRuleSchema, updateAvailabilityRuleSchema } from "../dtos/availability.dto";

export const availabilityRouter =  Router();

availabilityRouter.use(requireUserId);

availabilityRouter.get('/rules', listRules);
availabilityRouter.post('/rules', validate(createAvailabilityRuleSchema), createRule);
availabilityRouter.patch('/rules/:ruleId', validate(updateAvailabilityRuleSchema), updateRule);
availabilityRouter.delete('/rules/:ruleId', deleteRule);

//-----------

availabilityRouter.get('/exception', listExceptions);
availabilityRouter.post('/exceptions', validate(createAvailabilityExceptionSchema), createException);
availabilityRouter.patch('/exceptions/:exceptionId', validate(updateAvailabilityExceptionRuleSchema), updateException);
availabilityRouter.delete('/exceptions/:exceptionId', deleteException);