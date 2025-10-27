import { FastifyInstance } from "fastify";
import * as userController from "../controllers/user.controllers.js";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.post("/users", userController.createUser);
  fastify.get("/users", userController.getAllUsers);
  fastify.get("/users/:id", userController.getUserById);
  fastify.put("/users/:id", userController.updateUser);
  fastify.delete("/users/:id", userController.deleteUser);

}

