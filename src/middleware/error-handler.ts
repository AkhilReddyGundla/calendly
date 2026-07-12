import { node_env } from "../config/env";
import { ApiError } from "../utils/api-error"
import { Request, Response, NextFunction } from "express"

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction)=>{
    if(err instanceof ApiError){
        const body: Record<string, any> = {
            success: false,
            message: err.message,
            timestamp: new Date().toISOString(),
        };
        if(err.details) body.details = err.details;
        res.status(err.statusCode).json(body);
        return;
    }
    const body: Record<string, any> = {
        success: false,
        message: "something went wrong",
    }
    if(node_env == "development")body.details = err.stack;
    res.status(500).json(body);
    return;
}   