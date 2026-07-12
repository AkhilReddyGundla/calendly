import { Response } from "express";

interface SuccessPayload<T> {
    success: true;
    data ?: T;
    message: string;
}

export const sendSuccess = <T>(res: Response, data?: T, message = "Success")=>{
    const payload : SuccessPayload<T> = {
        success : true,
        data,
        message,
    };

    if(message)payload.message = message;
    res.status(200).json(payload);
}