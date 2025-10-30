import { z } from "zod";
import { successResponseSchema } from "./common.schema.js";

/* ----------------------------
   1️  Request Validation Schemas
----------------------------- */

//  Create User request schema
export const createUserSchema = z.object({
  body: z.object({
    first_name: z.string().min(2, "First name is required"),
    last_name: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email format"),
  }),
});

//  Update User request schema
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

/* ----------------------------
   2️  Response Validation Schemas
----------------------------- */

//   Address schema — used when user includes addresses
export const addressSchema = z.object({
  id: z.number(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  block: z.string().nullable().optional(),
  pincode: z.string(),
  user_id: z.number(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

//   Base User Schema — include addresses optionally
export const userSchema = z.object({
  id: z.number().optional(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  addresses: z.array(addressSchema).optional(), //  added line
});

/* ----------------------------
   3️  Response Schemas (for Fastify)
----------------------------- */

//  Users without addresses
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

//  Users with addresses (and others)
export const createUserResponseSchema = successResponseSchema(userSchema);
export const getAllUsersResponseSchema = successResponseSchema(
  z.array(userSchema)
);
export const getUserByIdResponseSchema = successResponseSchema(userSchema);
export const deleteUserResponseSchema = successResponseSchema(
  z.object({ message: z.string() })
);

/* ----------------------------
   4️  TypeScript helper types
----------------------------- */

export type CreateUserInput = z.infer<typeof createUserSchema>["body"];
export type UpdateUserInput = z.infer<typeof updateUserSchema>["body"];
export type UserResponse = z.infer<typeof userSchema>;
