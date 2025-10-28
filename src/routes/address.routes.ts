import { FastifyInstance } from "fastify";
import * as addressController from "../controllers/address.controllers.js";

export default async function addressRoutes(fastify: FastifyInstance) {
  fastify.post("/addresses", addressController.createAddress);
  fastify.get("/addresses", addressController.getAllAddresses);
  fastify.get("/addresses/user/:user_id", addressController.getAddressesByUserId);

  fastify.get("/addresses/:id", addressController.getAddressById);
  

  fastify.put("/addresses/:id", addressController.updateAddress);
  fastify.delete("/addresses/:id", addressController.deleteAddress);
}
