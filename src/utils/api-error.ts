export class ApiError extends Error{
    readonly statusCode : number;
    readonly details? : unknown;

    constructor(statusCode : number, errorMessage : string, details?: unknown){
        super(errorMessage);
        this.statusCode = statusCode;
        this.details = details;
        this.message = errorMessage;
        this.name = "Api Error";
        Error.captureStackTrace(this, this.constructor);
    }

}

export const badRequest = (message: string, details?: unknown) => new ApiError(400, message, details);
export const unauthorized = (message: string, details?: unknown) => new ApiError(401, message, details);
export const forbidden = (message: string, details?: unknown) => new ApiError(403, message, details);
export const notFound = (message: string, details?: unknown) => new ApiError(404, message, details);
export const internalServerError = (message = "Internal Server Error", details?: unknown) => new ApiError(500, message, details);

