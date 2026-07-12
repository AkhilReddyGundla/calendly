import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { badRequest } from "../utils/api-error";

export const validate = (schema: ZodSchema) =>(req: Request, _res: Response, next: NextFunction)=>{
    const result = schema.safeParse(req.body);
    if(!result.success){
        throw badRequest('user validation failed', result.error.issues);
    }
    req.body = result.data;
    next();
}

export const validateParams = (schema: ZodSchema)=>(req: Request, _res: Response, next: NextFunction)=>{
    const result = schema.safeParse(req.params);
    if(!result.success){
        throw badRequest('validation failed', result.error.issues);
    }
    req.body = result.data;
    next();
}

