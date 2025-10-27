// import { FastifyReply, FastifyRequest } from "fastify";
// import * as userService from "../services/user.services";

// export const createUser = async (req: FastifyRequest, reply: FastifyReply) => {
//   const data = await userService.createUser(req.body);
//   reply.code(201).send(data);
// };

// export const getAllUsers = async (req: FastifyRequest, reply: FastifyReply) => {
//   const users = await userService.getAllUsers();
//   reply.send(users);
// };

// export const getUserById = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
//   const user = await userService.getUserById(+req.params.id);
//   if (!user) return reply.code(404).send({ message: "User not found" });
//   reply.send(user);
// };

// export const updateUser = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
//   await userService.updateUser(+req.params.id, req.body);
//   reply.send({ message: "User updated successfully" });
// };

// export const deleteUser = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
//   await userService.deleteUser(+req.params.id);
//   reply.send({ message: "User deleted successfully" });
// };
import { FastifyReply, FastifyRequest } from "fastify";
import * as userService from "../services/user.services.js";
import {
  validateEmail,
  validateName,
  validateRequiredFields,
} from "../utils/validation.js";
import { ApiError, handleError } from "../utils/errorhandler.js";
 
/**
 *  CREATE USER
 * POST /users
 */

export const createUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const data: any = req.body;

    //  Check required fields
    const missing = validateRequiredFields(data, [
      "first_name",
      "last_name",
      "email",
    ]);
    if (missing.length > 0)
      throw new ApiError(`Missing fields: ${missing.join(", ")}`, 400);

    // Validate name and email
    if (!validateName(data.first_name) || !validateName(data.last_name)) {
      throw new ApiError("Names must contain only letters", 400);
    }
    if (!validateEmail(data.email)) {
      throw new ApiError("Invalid email format", 400);
    }
    const existingUser = await userService.findUserByEmail(data.email);
    if (existingUser) {
      throw new ApiError("Email already exists. Please use a different one.", 400);
    }

    // 3 Save user
    const newUser = await userService.createUser(data);
    reply
      .code(201)
      .send({ success: true, message: "User created successfully", data: newUser });
  } catch (error) {
    handleError(reply, error);
  }
};

/**
 *  GET ALL USERS
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
    const id = +req.params.id;

    if (isNaN(id)) throw new ApiError("Invalid user ID", 400);

    const user = await userService.getUserById(id);
    if (!user) throw new ApiError("User not found", 404);

    reply.send({ success: true, data: user });
  } catch (error) {
    handleError(reply, error);
  }
};

/**
 *  UPDATE USER
 * PUT /users/:id
 */
export const updateUser = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const id = +req.params.id;
    const data: any = req.body;

    if (isNaN(id)) throw new ApiError("Invalid user ID", 400);

    // Optional email validation (if provided)
    if (data.email && !validateEmail(data.email)) {
      throw new ApiError("Invalid email format", 400);
    }

    const [updated] = await userService.updateUser(id, data);

    if (updated === 0) throw new ApiError("User not found or no changes made", 404);

    reply.send({ success: true, message: "User updated successfully" });
  } catch (error) {
    handleError(reply, error);
  }
};

/**
 * ✅ DELETE USER
 * DELETE /users/:id
 */
export const deleteUser = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const id = +req.params.id;

    if (isNaN(id)) throw new ApiError("Invalid user ID", 400);

    const deleted = await userService.deleteUser(id);

    if (deleted === 0) throw new ApiError("User not found", 404);

    reply.send({ success: true, message: "User deleted successfully" });
  } catch (error) {
    handleError(reply, error);
  }
};
