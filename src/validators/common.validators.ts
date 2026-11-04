import { z } from "zod";
export const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),

    limit: z.coerce.number().int().positive().max(50).default(10),

    search: z.string().trim().max(100).optional(),
});
export const idParamSchema = z.object({
    id: z.string().trim().min(1, "ID is required"),
});
export const dateQuerySchema = z.object({
    date: z.iso.date().optional(),
});
export type paginationInput = z.infer<typeof paginationSchema>;
export type IDParamInput = z.infer<typeof idParamSchema>;
export type dateQueryInput = z.infer<typeof dateQuerySchema>;