import { z } from "zod";
export const loginSchema = z.object({
    email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),

    password: z
    .string()
    .min(1, "Password is required"),
});

export const registerSchema = z.object({
    name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 charachter")
    .max(100, "Name cannot exceed 100 charachters"),

    email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),

    phone: z
    .string()
    .trim()
    .min(10, "Phone number must contain at least 10 characters")
    .max(20, "Phone number cannot exceed 20 characters"),

    password: z
    .string()
    .min(8, "Password must contain at laest 8 characters")
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;