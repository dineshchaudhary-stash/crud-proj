import { FastifyInstance } from "fastify";
import { z } from "zod";
import * as userController from "../controllers/user.controllers.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  createUserSchema,
  updateUserSchema,
  createUserResponseSchema,
  getAllUsersResponseSchema,
  getUserByIdResponseSchema,
  deleteUserResponseSchema,
  getUsersOnlyResponseSchema, //  new response schema
} from "../schema/user.schema.js";

export default async function userRoutes(fastify: FastifyInstance) {
  //  Create User
  fastify.post("/users", {
    schema: {
      body: zodToJsonSchema(createUserSchema.shape.body),
      response: {
        201: zodToJsonSchema(createUserResponseSchema),
      },
    },
    handler: userController.createUser,
  });

  //  Get All Users (with addresses)
  fastify.get("/users", {
    schema: {
      response: {
        200: zodToJsonSchema(getAllUsersResponseSchema),
      },
    },
    handler: userController.getAllUsers,
  });

  //  Get Users without Addresses
  fastify.get("/users/no-addresses", {
    schema: {
      response: {
        200: zodToJsonSchema(getUsersOnlyResponseSchema),
      },
    },
    handler: userController.getUsersWithoutAddresses,
  });

  //  Get Users Only (no nested address info)
  fastify.get("/users/only", {
    schema: {
      response: {
        200: zodToJsonSchema(getUsersOnlyResponseSchema),
      },
    },
    handler: userController.getUsersOnly,
  });

  //  Get User by ID
  fastify.get("/users/:id", {
    schema: {
      response: {
        200: zodToJsonSchema(getUserByIdResponseSchema),
      },
    },
    handler: userController.getUserById,
  });

  //  Update User
  fastify.put("/users/:id", {
    schema: {
      body: zodToJsonSchema(updateUserSchema.shape.body),
      params: zodToJsonSchema(updateUserSchema.shape.params),
      response: {
        200: zodToJsonSchema(
          z.object({
            success: z.boolean(),
            message: z.string(),
          })
        ),
      },
    },
    handler: userController.updateUser,
  });

  //  Delete User
  fastify.delete("/users/:id", {
    schema: {
      response: {
        200: zodToJsonSchema(deleteUserResponseSchema),
      },
    },
    handler: userController.deleteUser,
  });
}
