import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/app-error";
export const errorMiddleware: ErrorRequestHandler = (
    error: unknown,
    _req,
    res,
    _next
): void => {
    console.error("API Error:", error);
    if (error instanceof ZodError){
        res.status(400).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "Request validation failed",
                details: error.issues,
            },
        });
        return;
    }
    if (error instanceof AppError){
        res.status(error.statusCode).json({
            error: {
                code: error.code,
                message: error.message,
        },
        });
        return;
    }
    console.error("API Error: ", error);
    res.status(500).json({
        error: {
            code: "INTENAL_SERVER_ERROR",
            message: "An unexpected error occured",
        },
    });
};