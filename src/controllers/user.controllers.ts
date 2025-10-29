import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import * as userService from "../services/user.services.js";
import { ApiError, handleError } from "../utils/errorhandler.js";
import { createUserSchema, updateUserSchema } from "../schema/user.schema.js";

/**
 * CREATE USER
 * POST /users
 */
export const createUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    //  Validate request using Zod
    const parsed = createUserSchema.parse(req);
    const data = parsed.body;

    // Check if email already exists
    const existingUser = await userService.findUserByEmail(data.email);
    if (existingUser) {
      throw new ApiError("Email already exists. Please use a different one.", 400);
    }

    // Create new user
    const newUser = await userService.createUser(data);

    reply.code(201).send({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return reply.code(400).send({
        success: false,
        message: "Validation failed",
        errors: error.issues,
      });
    }
    handleError(reply, error);
  }
};

/**
 * GET ALL USERS
 * GET /users
 */
export const getAllUsers = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const users = await userService.getAllUsers();
    reply.send({ success: true, data: users });
  } catch (error) {
    handleError(reply, error);
  }
};

/**
 * GET USER BY ID
 * GET /users/:id
 */
export const getUserById = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new ApiError("Invalid user ID", 400);

    const user = await userService.getUserById(id);
    if (!user) throw new ApiError("User not found", 404);

    reply.send({ success: true, data: user });
  } catch (error) {
    handleError(reply, error);
  }
};

/**
 * UPDATE USER
 * PUT /users/:id
 */
export const updateUser = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    //  Validate request with Zod
    const parsed = updateUserSchema.parse(req);
    const id = Number(parsed.params.id);
    const data = parsed.body;

    const [updated] = await userService.updateUser(id, data);

    if (updated === 0)
      throw new ApiError("User not found or no changes made", 404);

    reply.send({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return reply.code(400).send({
        success: false,
        message: "Validation failed",
        errors: error.issues,
      });
    }
    handleError(reply, error);
  }
};

/**
 * DELETE USER
 * DELETE /users/:id
 */
export const deleteUser = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new ApiError("Invalid user ID", 400);

    const deleted = await userService.deleteUser(id);
    if (deleted === 0) throw new ApiError("User not found", 404);

    reply.send({ success: true, message: "User deleted successfully" });
  } catch (error) {
    handleError(reply, error);
  }
};
