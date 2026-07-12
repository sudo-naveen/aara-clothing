import { z } from "zod";

export const createOrderItemSchema = z.object({
  variantId: z.string().min(1, "Variant is required"),
  quantity: z.number().int().positive("Quantity must be greater than zero"),
});

export const createOrderSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  items: z
    .array(createOrderItemSchema)
    .min(1, "At least one item is required"),
});

export const updateOrderItemSchema = z.object({
  variantId: z.string().min(1, "Variant is required"),
  quantity: z.number().int().positive("Quantity must be greater than zero"),
});

export const updateOrderSchema = z.object({
  items: z
    .array(updateOrderItemSchema)
    .min(1, "At least one item is required"),
});

export const orderStatusSchema = z.object({
  status: z.enum(["NOT_STARTED", "PROCESSING", "DONE"]),
});

export const orderQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  customerId: z.string().optional(),
});

export type CreateOrderItemInput = z.infer<typeof createOrderItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderItemInput = z.infer<typeof updateOrderItemSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type OrderStatusInput = z.infer<typeof orderStatusSchema>;
export type OrderQuery = z.infer<typeof orderQuerySchema>;
