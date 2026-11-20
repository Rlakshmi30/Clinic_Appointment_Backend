import { listenerCount } from "node:cluster";
import { z } from "zod";
export const createDoctorSchema = z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(255),
    password: z.string().min(8).max(72),
    phone: z.string().trim().min(10).max(12),
    specialization: z.string().trim().min(2).max(100),
    licenseNumber: z.string().trim().min(3).max(100),
    consultationFee: z.number().int().min(0),
    experienceYears: z.number().int().min(0),
    bio: z.string().max(1000).optional(),

    slotDuration: z.union([
        z.literal(15),
        z.literal(20),
        z.literal(30),
    ]),
});
export type CreateDoctorInput = z.infer<
typeof createDoctorSchema
>; 