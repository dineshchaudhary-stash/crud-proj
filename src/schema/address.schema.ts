import { z } from "zod";

export const createAddressSchema = z.object({
  body: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().length(6, "Pincode must be 6 digits"),
    block: z.string().optional(), // 
     userId: z.number(), // Added this
  }),
});

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

//  Types for TypeScript
export type CreateAddressInput = z.infer<typeof createAddressSchema>["body"];
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>["body"];
