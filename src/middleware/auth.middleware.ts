import { Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/app-error";
export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: "admin" | "doctor" | "patient";
    };
}
 export const authenticate = (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
 ) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")){
            throw new AppError ("Authentication required", 401, "UNAUTHORIZED");
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, env.JWT_SECRET);
        if (
            typeof decoded === "string" ||
            typeof decoded.userId !== "string" ||
            !["admin", "doctor", "patient"].includes(decoded.role)
        ) {
            throw new AppError("Invalid access token", 401, "INVALID_TOKEN");
        }
        req.user = {
            id: decoded.userId,
            role: decoded.role as "admin" | "doctor" | "patient", 
        };
        next();
    } catch(error) {
        if (error instanceof AppError) {
            next(error);
            return;
        }
        next(new AppError("Invalid or expired access token", 401, "INVALID_TOKEN"));
    }
 };
 export const authorize = (...roles: Array<"admin" | "doctor" | "patient">) => {
    return (req: AuthRequest, _res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)){
            next(new AppError("Access denied", 403, "FORBIDDEN"));
            return;
        }
        next();
    };
 };