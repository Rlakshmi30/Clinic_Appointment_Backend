import { Request, Response, NextFunction } from "express";
import { createDoctorServices } from "../services/doctor.service";

export const createDoctorController = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const doctor = await createDoctorServices(req.body);

        res.status(201).json({
            success: true,
            message: "Doctor created successfully",
            data: doctor,
        });
    } catch (error) {
        next(error);
    }
};