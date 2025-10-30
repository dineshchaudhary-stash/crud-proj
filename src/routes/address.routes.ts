import { FastifyInstance } from "fastify";
import * as addressController from "../controllers/address.controllers.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  createAddressSchema,
  updateAddressSchema,
  getAddressByUserSchema,
  getAddressByPincodeSchema,
  createAddressResponseSchema,
  getAllAddressesResponseSchema,
  getAddressByIdResponseSchema,
  updateAddressResponseSchema,
  deleteAddressResponseSchema,
} from "../schema/address.schema.js";

export default async function addressRoutes(fastify: FastifyInstance) {
  //  Create Address
  fastify.post("/addresses", {
    schema: {
      body: zodToJsonSchema(createAddressSchema.shape.body),
      response: {
        201: zodToJsonSchema(createAddressResponseSchema),
      },
    },
    handler: addressController.createAddress,
  });

  //  Get All Addresses (optional ?pincode=)
  fastify.get("/addresses", {
    schema: {
      response: {
        200: zodToJsonSchema(getAllAddressesResponseSchema),
      },
    },
    handler: addressController.getAllAddresses,
  });

  //  Get Address by ID
  fastify.get("/addresses/:id", {
    schema: {
      response: {
        200: zodToJsonSchema(getAddressByIdResponseSchema),
      },
    },
    handler: addressController.getAddressById,
  });

  //  Get Addresses by User ID
  fastify.get("/addresses/user/:userId", {
    schema: {
      params: zodToJsonSchema(getAddressByUserSchema.shape.params),
      response: {
        200: zodToJsonSchema(getAllAddressesResponseSchema),
      },
    },
    handler: addressController.getAddressesByUserId,
  });

  //  Get Addresses by Pincode
  fastify.get("/addresses?pincode=:pincode", {
    schema: {
      params: zodToJsonSchema(getAddressByPincodeSchema.shape.params),
      response: {
        200: zodToJsonSchema(getAllAddressesResponseSchema),
      },
    },
    handler: addressController.getAddressesByPincode,
  });

  //  Update Address
  fastify.put("/addresses/:id", {
    schema: {
      body: zodToJsonSchema(updateAddressSchema.shape.body),
      response: {
        200: zodToJsonSchema(updateAddressResponseSchema),
      },
    },
    handler: addressController.updateAddress,
  });

  //  Delete Address
  fastify.delete("/addresses/:id", {
    schema: {
      response: {
        200: zodToJsonSchema(deleteAddressResponseSchema),
      },
    },
    handler: addressController.deleteAddress,
  });
}
