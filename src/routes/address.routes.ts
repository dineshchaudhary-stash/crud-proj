import { FastifyInstance } from "fastify";
import * as addressController from "../controllers/address.controllers.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  createAddressSchema,
  updateAddressSchema,
  getAddressByUserSchema,
  getAddressByPincodeSchema,
} from "../schema/address.schema.js";

export default async function addressRoutes(fastify: FastifyInstance) {
  //  Create Address
  fastify.post("/addresses", {
    schema: {
      body: zodToJsonSchema(createAddressSchema.shape.body),
    },
    handler: addressController.createAddress,
  });

  //  Get All Addresses (optional pincode query)
  fastify.get("/addresses", addressController.getAllAddresses);

  //  Get Address by ID
  fastify.get("/addresses/:id", addressController.getAddressById);

  //  Get Addresses by User ID
  fastify.get("/addresses/user/:userId", {
    schema: {
      params: zodToJsonSchema(getAddressByUserSchema.shape.params),
    },
    handler: addressController.getAddressesByUserId,
  });

  //  Get Addresses by Pincode
  fastify.get("/addresses?pincode=:pincode", {
    schema: {
      params: zodToJsonSchema(getAddressByPincodeSchema.shape.params),
    },
    handler: addressController.getAddressesByPincode,
  });

  //  Update Address
  fastify.put("/addresses/:id", {
    schema: {
      body: zodToJsonSchema(updateAddressSchema.shape.body),
    },
    handler: addressController.updateAddress,
  });

  //  Delete Address
  fastify.delete("/addresses/:id", addressController.deleteAddress);
}
