import { CreateAvailabilityExceptionDTO, CreateAvailabilityRuleDTO, UpdateAvailabilityExceptionDTO, UpdateAvailabilityRuleDTO } from "../dtos/availability.dto";
import { getRulesByUser, getRuleById, listRulesByHost, createRule, updateRule, deleteRule, listExceptionsByUser, getExceptionsById, createException, updateException, deleteException } from "../repositories/availability.repositry"
import { forbidden, notFound } from "../utils/api-error";


export const findRulesByHost = async(hostId: number)=>{
    const rules = await listRulesByHost(hostId);
    if(!rules){
        throw notFound("No rules found for requested user");
    }
    return rules; 
}


export const createHostRule = async(hostId: number, data: CreateAvailabilityRuleDTO)=>{
    const rule = await createRule(hostId, data);
    return rule;
}

export const updateHostRule = async(hostId:number, ruleId: number, data: UpdateAvailabilityRuleDTO)=>{

    const rule = await getRuleById(ruleId);
    if(!rule){
        throw notFound("Availability rule is found");
    }
    if(hostId !== rule.hostId){
        throw forbidden("You are not authorized to access this availability rule");
    }

    const updatedRule = await updateRule(ruleId, data)

    return updatedRule;
}

export const deleteHostRule = async(hostId: number, ruleId: number)=>{
    const rule = await getRuleById(ruleId);
    if(!rule){
        throw notFound("Availability rule is found ")
    }
    
    if(hostId !== rule.hostId){
        throw forbidden("You are not authorized to access this availability rule");
    }
    const removedRule = await deleteRule(ruleId);
    return removedRule;
}

//----

export const findAvailabilityExceptions = async(hostId: number)=>{
    const exceptions = await listExceptionsByUser(hostId);
    return exceptions; 
}

export const createAvilabilityException = async(hostId: number, data: CreateAvailabilityExceptionDTO)=>{
    const exceptionRule = await createException(hostId, data);
    return exceptionRule;
}

export const updateAvailabilityException = async(exceptionId: number, hostId: number, data: UpdateAvailabilityExceptionDTO)=>{
    const exception = await getExceptionsById(exceptionId);
    if(!exception){
        throw notFound("Availability exception is not found");
    }

    if(exception.hostId !== hostId){
        throw forbidden("You are not authorized to access this availability exception");
    }
    const updatedException = await updateException(exceptionId, data);
    return updatedException;
}

export const deleteAvailabilityException = async(hostId: number, exceptionId: number)=>{
    const exception = await getExceptionsById(exceptionId);
    if(!exception){
        throw notFound("Availability exception is not found");
    }

    if(exception.hostId !== hostId){
        throw forbidden("You are not authorized to access this availability exception");
    }
    const deletedException = await deleteException(exceptionId);
    return deletedException;
}