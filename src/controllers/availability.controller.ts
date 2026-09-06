import { Request, Response } from "express"
import { createAvilabilityException, createUserRule, deleteAvailabilityException, deleteUserRule, findAvailabilityExceptions, findRulesByUser, updateAvailabilityException, updateUserRule } from "../services/availability.service";
import { sendSuccess } from "../utils/api-response";
import { CreateAvailabilityExceptionDTO, CreateAvailabilityRuleDTO, UpdateAvailabilityExceptionDTO, UpdateAvailabilityRuleDTO } from "../dtos/availability.dto";

export const listRules = async (req: Request, res: Response)=>{
    const userId = req.userId;
    const rules = await findRulesByUser(userId);
    sendSuccess(res, rules, "Successfully fetched rules");
}

export const createRule = async(req: Request, res: Response)=>{
    const userId = req.userId;
    const data: CreateAvailabilityRuleDTO = req.body;
    const rule = await createUserRule(userId, data);
    sendSuccess(res, rule, "Successfully created new rule");
}

export const updateRule = async(req: Request, res: Response)=>{
    const userId = req.userId;
    const {ruleId} = req.params;
    const data: UpdateAvailabilityRuleDTO = req.body;
    const updatedRule = await updateUserRule(userId, Number(ruleId), data);
    sendSuccess(res, updatedRule, "Successfully updated rule")
}

export const deleteRule = async(req: Request, res: Response)=>{
    const userId = req.userId;
    const {ruleId} = req.params;
    const deletedRule = await deleteUserRule(userId, Number(ruleId));
    sendSuccess(res, deletedRule, "Rule deleted successfully");
}

//---------------------


export const listExceptions = async(req: Request, res: Response)=>{
    const userId = req.userId;
    const exceptions = await findAvailabilityExceptions(userId);
    sendSuccess(res, exceptions, "Fetched exception successfully");
}

export const createException = async(req: Request, res: Response)=>{
    const userId = req.userId;
    const data: CreateAvailabilityExceptionDTO = req.body;
    const exception = await createAvilabilityException(userId, data);
    sendSuccess(res, exception, "Created exception");
}

export const updateException = async(req: Request, res: Response)=>{
    const userId = req.userId;
    const {exceptionId} = req.params;
    const data: UpdateAvailabilityExceptionDTO = req.body;
    const updatedException = await updateAvailabilityException(Number(exceptionId), userId, data);
    sendSuccess(res, updatedException, "Updated exception");
}

export const deleteException = async(req: Request, res: Response)=>{
    const userId = req.userId;
    const {exceptionId} = req.params;
    const deletedException = await deleteAvailabilityException(userId, Number(exceptionId));
    sendSuccess(res, deletedException, "Successfully deleted exception");
}