import { prisma } from "../config/database"
import { CreateAvailabilityExceptionDTO, CreateAvailabilityRuleDTO, UpdateAvailabilityExceptionDTO, UpdateAvailabilityRuleDTO } from "../dtos/availability.dto";

export const listRulesByHost = async(hostId: number)=>{
    const availbilityRules = await prisma.availabilityRule.findMany({
        where: {hostId},
        orderBy :[{"weekday": "asc"}, {"startTime": "asc"}],
    })
    return availbilityRules;
}

export const getRulesByUser = async(userId: number)=>{
    const availbilityRules = await prisma.availabilityRule.findMany({
        where: {userId, isActive: true},
        orderBy: [{"weekday": "asc"}, {"startTime": "asc"}],
    })

    return availbilityRules;
}

export const listActiveRulesByUser = async(userId: number)=>{
    const activeAvailabilityRules = await prisma.availabilityRule.findMany({
        where : {
            userId,
            isActive : true, 
        }
    })
    return activeAvailabilityRules;
}

export const getRuleById = async(id: number)=>{
    const avalibilityRule = await prisma.availabilityRule.findUnique({
        where: {id},
    });
    return avalibilityRule;
}

export const createRule = async(hostId: number, data: CreateAvailabilityRuleDTO)=>{
    const newAvalibilityRule = await prisma.availabilityRule.create({
        data: {
            hostId,
            ...data
        }
    });
    return newAvalibilityRule;
}

export const updateRule = async(id: number, data: UpdateAvailabilityRuleDTO)=>{
    const updateAvailability = await prisma.availabilityRule.update({
        where: {id},
        data,
    })
    return updateAvailability;
}

export const deleteRule = async(id: number)=>{
    await prisma.availabilityRule.delete({
        where: {id},
    })
}

// -------------

export const listExceptionsByUser = async(hostId: number)=>{
    const exceptions = await prisma.availabilityException.findMany({
        where: {hostId},
    });
    return exceptions;
}

export const getExceptionsById = async(id: number)=>{
    const exception = await prisma.availabilityException.findUnique({
        where: {id},
    })
    return exception;
}

export const findExceptionsInRange = async(userId: number, startDate: Date, endDate: Date)=>{
    const exceptions = await prisma.availabilityException.findMany({
        where: {userId,
            date : {
                gte: startDate,
                lte: endDate
            },
        },
        orderBy: {date: "asc"},
    });

    return exceptions;
}

export const createException = async(hostId: number, data: CreateAvailabilityExceptionDTO)=>{
    const exceptionRule = await prisma.availabilityException.create({
        data: {
            hostId,
            ...data,
        }
    });

    return exceptionRule;
}

export const updateException = async(id: number, data: UpdateAvailabilityExceptionDTO)=>{
    return prisma.availabilityException.update({
        where: {id},
        data,
    })
}

export const deleteException = async(id: number)=>{
    await prisma.availabilityException.delete({
        where: {id},
    })
}