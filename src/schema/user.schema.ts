import { z } from "zod";

//  For creating a new user
export const createUserSchema = z.object({
  body: z.object({
    first_name: z.string().min(2, "First name is required"),
    last_name: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email format"),
  }),
});

//  For updating an existing user
export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Invalid user ID"),
  }),
  body: z.object({
    first_name: z.string().min(2).optional(),
    last_name: z.string().min(2).optional(),
    email: z.string().email("Invalid email format").optional(),
  }),
});

//  Optional TypeScript types for strong typing in controllers/services
export type CreateUserInput = z.infer<typeof createUserSchema>["body"];
export type UpdateUserInput = z.infer<typeof updateUserSchema>["body"];
