import { z } from "zod";
import { successResponseSchema } from "./common.schema.js";




// Address Object Schema
export const addressSchema = z.object({
  id: z.number(),
  user_id: z.number().nullable(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  block: z.string().nullable().optional(),
  pincode: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
//  Create Address Schema (userId required)
export const createAddressSchema = z.object({
  body: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().length(6, "Pincode must be 6 digits"),
    userId: z.number({ required_error: "userId is required!" }),
    block: z.string().optional(),
  }),
});

//  Update Address Schema (userId optional)
export const updateAddressSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Invalid ID"),
  }),
  body: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().length(6).optional(),
    userId: z.number().optional(),
    block: z.string().optional(),
  }),
});

export const getAddressByUserSchema = z.object({
  params: z.object({
    userId: z.string().regex(/^\d+$/, "Invalid userId"),
  }),
});

export const getAddressByPincodeSchema = z.object({
  params: z.object({
    pincode: z
      .string()
      .regex(/^\d{6}$/, "Invalid pincode format (must be 6 digits)"),
  }),
});


// Response Schemas

//  Response schemas
export const createAddressResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: addressSchema,
});

export const getAllAddressesResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(addressSchema),
});

export const getAddressByIdResponseSchema = z.object({
  success: z.boolean(),
  data: addressSchema,
});

export const updateAddressResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const deleteAddressResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
  message: z.string(),
    }),
});

//  Types for TypeScript
export type CreateAddressInput = z.infer<typeof createAddressSchema>["body"];
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>["body"];
export type AddressResponse = z.infer<typeof addressSchema>;
