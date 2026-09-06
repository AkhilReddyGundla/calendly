import { CreateAvailabilityExceptionDTO, CreateAvailabilityRuleDTO, UpdateAvailabilityRuleDTO } from "../dtos/availability.dto";
import { getRulesByUser, getRuleById, listRulesByUser, createRule, updateRule, deleteRule, listExceptionsByUser, getExceptionsById, createException, updateException, deleteException } from "../repositories/availability.repositry"
import { forbidden, notFound } from "../utils/api-error";


export const findRulesByUser = async(userId: number)=>{
    const rules = await listRulesByUser(userId);
    if(!rules){
        throw notFound("No rules found for requested user");
    }
    return rules; 
}


export const createUserRule = async(userId: number, data: CreateAvailabilityRuleDTO)=>{
    const rule = await createRule(userId, data);
    return rule;
}

export const updateUserRule = async(userId:number, ruleId: number, data: UpdateAvailabilityRuleDTO)=>{

    const rule = await getRuleById(ruleId);
    if(!rule){
        throw notFound("Availability rule is found");
    }
    if(userId !== rule.userId){
        throw forbidden("You are not authorized to access this availability rule");
    }

    const updatedRule = await updateRule(userId, data)

    return updatedRule;
}

export const deleteUserRule = async(userId: number, ruleId: number)=>{
    const rule = await getRuleById(ruleId);
    if(!rule){
        throw notFound("Availability rule is found ")
    }
    
    if(userId !== rule.userId){
        throw forbidden("You are not authorized to access this availability rule");
    }
    const removedRule = await deleteRule(ruleId);
    return removedRule;
}

//----

export const findAvailabilityExceptions = async(userId: number)=>{
    const exceptions = await listExceptionsByUser(userId);
    return exceptions; 
}

export const createAvilabilityException = async(userId: number, data: CreateAvailabilityExceptionDTO)=>{
    const createdException = await createException(userId, data);
    return createdException;
}

export const updateAvailabilityException = async(exceptionId: number, userId: number, data: UpdateAvailabilityRuleDTO)=>{
    const exception = await getExceptionsById(exceptionId);
    if(!exception){
        throw notFound("Availability exception is not found");
    }

    if(exception.userId !== userId){
        throw forbidden("You are not authorized to access this availability exception");
    }
    const updatedException = await updateException(userId, data);
    return updatedException;
}

export const deleteAvailabilityException = async(userId: number, exceptionId: number)=>{
    const exception = await getExceptionsById(exceptionId);
    if(!exception){
        throw notFound("Availability exception is not found");
    }

    if(exception.userId !== userId){
        throw forbidden("You are not authorized to access this availability exception");
    }
    const deletedException = await deleteException(exceptionId);
    return deletedException;
}