import { z } from "zod";

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters")
    .transform((val) => val.trim()),
  password: z
    .string()
    .min(1, "Password is required")
    .min(3, "Password must be at least 3 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
