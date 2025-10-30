import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import * as addressService from "../services/address.services.js";
import { ApiError, handleError } from "../utils/errorhandler.js";
import { User } from "../models/user.model.js";
import {
  createAddressSchema,
  updateAddressSchema,
  getAddressByUserSchema,
  getAddressByPincodeSchema,
} from "../schema/address.schema.js";

/**
 * POST /addresses
 * body: { user_id, street, city, state, pincode }
 */
export const createAddress = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    //  Validate request using Zod
    const parsed = createAddressSchema.parse(req);
    const data = parsed.body;

    //  Validate user existence
    const user = await User.findByPk(data.userId);
    if (!user) throw new ApiError("User not found for provided userId", 404);

    //  Create address
    const newAddress = await addressService.createAddress({
      user_id: data.userId,
      street: data.street,
      city: data.city,
      state: data.state,
      block: data.block,
      pincode: String(data.pincode),
    });

    reply.code(201).send({
      success: true,
      message: "Address created successfully",
      data: newAddress,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return reply.code(400).send({
        success: false,
        message: "Validation failed",
        issues: error.issues, //  correct property name
      });
    }
    handleError(reply, error);
  }
};
/**
 * GET /addresses
 * optional query: ?pincode=411001
 */
export const getAllAddresses = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const q = req.query as any;
    const addresses = await addressService.getAllAddresses(q?.pincode);
    reply.send({ success: true, data: addresses });
  } catch (error) {
    handleError(reply, error);
  }
};

/**
 * GET /addresses/:id
 */
export const getAddressById = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new ApiError("Invalid address ID", 400);

    const address = await addressService.getAddressById(id);
    if (!address) throw new ApiError("Address not found", 404);

    reply.send({ success: true, data: address });
  } catch (error) {
    handleError(reply, error);
  }
};

/**
 * GET /addresses/user/:user_id
 */
export const getAddressesByUserId = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    //  Validate user_id
    const parsed = getAddressByUserSchema.parse(req);
    const userId = Number(parsed.params.userId);

    const addresses = await addressService.getAddressesByUserId(userId);
    if (!addresses || addresses.length === 0)
      throw new ApiError("No addresses found for this user", 404);

    reply.send({ success: true, data: addresses });
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
 * GET /addresses/pincode/:pincode
 */
export const getAddressesByPincode = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    // Validate pincode
    const parsed = getAddressByPincodeSchema.parse(req);
    const { pincode } = parsed.params;

    const addresses = await addressService.getAddressesByPincode(pincode);

    if (!addresses || addresses.length === 0)
      throw new ApiError("No addresses found for this pincode", 404);

    reply.send({ success: true, data: addresses });
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
 * PUT /addresses/:id
 */
export const updateAddress = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    //  Validate request
    const parsed = updateAddressSchema.parse(req);
    const id = Number(parsed.params.id);
    const data = parsed.body;

    const [updated] = await addressService.updateAddress(id, data);
    if (updated === 0)
      throw new ApiError("Address not found or no changes made", 404);

    reply.send({ success: true, message: "Address updated successfully" });
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
 * DELETE /addresses/:id
 */
export const deleteAddress = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new ApiError("Invalid address ID", 400);

    const deleted = await addressService.deleteAddress(id);
    if (deleted === 0) throw new ApiError("Address not found", 404);

    reply.send({ success: true, data: { message: "Address deleted successfully" }

    });
  } catch (error) {
    handleError(reply, error);
  }
};
