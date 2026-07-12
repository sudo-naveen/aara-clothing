import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name must be 100 characters or less"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(100, "New password must be 100 characters or less"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const lowStockThresholdSchema = z.object({
  threshold: z
    .number()
    .int("Threshold must be a whole number")
    .min(1, "Threshold must be at least 1")
    .max(9999, "Threshold must be 9999 or less"),
});

export type LowStockThresholdInput = z.infer<typeof lowStockThresholdSchema>;

export const createUserSchema = z
  .object({
    name: z
      .string()
      .min(1, "Full name is required")
      .max(100, "Full name must be 100 characters or less"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be 50 characters or less")
      .regex(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be 100 characters or less"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm the password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  id: z.string().uuid("Invalid user ID"),
  name: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name must be 100 characters or less"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be 50 characters or less")
    .regex(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores"),
  isAdmin: z.boolean(),
  isActive: z.boolean(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
