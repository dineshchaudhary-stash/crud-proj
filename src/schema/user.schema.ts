import { z } from "zod";
import { successResponseSchema } from "./common.schema.js";
//  For creating a new user for request body
export const createUserSchema = z.object({
  body: z.object({
    first_name: z.string().min(2, "First name is required"),
    last_name: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email format"),
  }),
});

//  For updating an existing user for request body and params
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
//Base User Schema — define FIRST
export const userSchema = z.object({
  id: z.number().optional(),
  first_name: z.string(),
  last_name: z.string(),
 email: z.string().email(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export const getUsersOnlyResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(
    z.object({
      id: z.number(),
      first_name: z.string(),
      last_name: z.string(),
      email: z.string().email(),
    })
  ),
});

//  3 Response Schemas (now userSchema exists)
export const createUserResponseSchema = successResponseSchema(userSchema);
export const getAllUsersResponseSchema = successResponseSchema(
  z.array(userSchema)
);
export const getUserByIdResponseSchema = successResponseSchema(userSchema);
export const deleteUserResponseSchema = successResponseSchema(
  z.object({ message: z.string() })
);

//  Optional TypeScript types for strong typing in controllers/services
export type CreateUserInput = z.infer<typeof createUserSchema>["body"];
export type UpdateUserInput = z.infer<typeof updateUserSchema>["body"];
export type UserResponse = z.infer<typeof userSchema>;