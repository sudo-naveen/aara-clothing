import { z } from "zod";

export const createVariantSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  color: z
    .string()
    .min(1, "Color is required")
    .max(50, "Color must be 50 characters or less"),
  size: z
    .string()
    .min(1, "Size is required")
    .max(50, "Size must be 50 characters or less"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
});

export const updateVariantSchema = z.object({
  color: z
    .string()
    .min(1, "Color is required")
    .max(50, "Color must be 50 characters or less")
    .optional(),
  size: z
    .string()
    .min(1, "Size is required")
    .max(50, "Size must be 50 characters or less")
    .optional(),
  stock: z.number().int().min(0, "Stock cannot be negative").optional(),
});

export type CreateVariantInput = z.infer<typeof createVariantSchema>;
export type UpdateVariantInput = z.infer<typeof updateVariantSchema>;
