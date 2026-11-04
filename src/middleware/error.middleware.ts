import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
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
    res.status(500).json({
        error: {
            code: "INTENAL_SERVER_ERROR",
            message: "An unexpected error occured",
        },
    });
};