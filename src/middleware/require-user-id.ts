import {Request, Response, NextFunction} from "express";
import { badRequest, unauthorized } from "../utils/api-error";

export const requireUserId = (req: Request, _res: Response, next: NextFunction)=>{
     const userIdHeader = req.headers['user-id'];
     if(!userIdHeader || typeof userIdHeader !== 'string'){
        throw unauthorized("UserId in header is requried");
     }
     // check valid user or not
     const userId = Number(userIdHeader);
     // check if ueser id present in DB (TODo in auth)
     if(Number.isNaN(userId)){
        throw badRequest("userId must be a number");
     }
    req.userId = userId;
    next();
}