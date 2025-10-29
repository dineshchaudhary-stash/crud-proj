import { FastifyInstance } from "fastify";
import * as userController from "../controllers/user.controllers.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import { createUserSchema, updateUserSchema } from "../schema/user.schema.js";

export default async function userRoutes(fastify: FastifyInstance) {
  //  Create User
  fastify.post("/users", {
    schema: {
      body: zodToJsonSchema(createUserSchema.shape.body),
      response: {
        201: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: { type: "object" },
          },
        },
      },
    },
    handler: userController.createUser,
  });

  //  Get All Users
  fastify.get("/users", userController.getAllUsers);
  // Get Users Only (no addresses)
  fastify.get("/users/no-addresses", userController.getUsersWithoutAddresses);

  // Get Users Only (no addresses)
  fastify.get("/users/only", userController.getUsersOnly);


  //  Get User by ID
  fastify.get("/users/:id", userController.getUserById);

  //  Update User
  fastify.put("/users/:id", {
    schema: {
      body: zodToJsonSchema(updateUserSchema.shape.body),
      params: zodToJsonSchema(updateUserSchema.shape.params),
    },
    handler: userController.updateUser,
  });

  //  Delete User
  fastify.delete("/users/:id", userController.deleteUser);
}
