
import { FastifyReply, FastifyRequest } from "fastify";
import * as addressService from "../services/address.services.js";
import { ApiError, handleError } from "../utils/errorhandler.js";
import { validatePincode, validateRequiredFields } from "../utils/validation.js";
import { User } from "../models/user.model.js"; // to verify user existence

/**
 * POST /addresses
 * body: { user_id, street, city, state, pincode }
 */
export const createAddress = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const data: any = req.body;

    // Required fields
    const missing = validateRequiredFields(data, ["user_id", "street", "city", "state", "pincode"]);
    if (missing.length > 0) throw new ApiError(`Missing fields: ${missing.join(", ")}`, 400);

    // Validate pincode
    if (!validatePincode(String(data.pincode))) {
      throw new ApiError("Invalid pincode format (expected 6 digits)", 400);
    }

    // Validate user exists
    const userId = Number(data.user_id);
    if (isNaN(userId)) throw new ApiError("Invalid user_id", 400);
    const user = await User.findByPk(userId);
    if (!user) throw new ApiError("User not found for provided user_id", 404);

    const newAddress = await addressService.createAddress({
      user_id: userId,
      street: data.street,
      city: data.city,
      state: data.state,
      block: data.block,
      pincode: String(data.pincode),
    });

    reply.code(201).send({ success: true, message: "Address created successfully", data: newAddress });
  } catch (error) {
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
    const pincode = q?.pincode ? String(q.pincode) : undefined;

    // If pincode provided, validate format
    if (pincode && !validatePincode(pincode)) {
      throw new ApiError("Invalid pincode format", 400);
    }

    const addresses = await addressService.getAllAddresses(pincode);
    reply.send({ success: true, data: addresses });
  } catch (error) {
    handleError(reply, error);
  }
};

/**
 * GET /addresses/:id
 */
export const getAddressById = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
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
export const getAddressesByUserId = async (
  req: FastifyRequest<{ Params: { user_id: string } }>,
  reply: FastifyReply
) => {
  try {
    const userid = Number(req.params.user_id);
    if (isNaN(userid)) throw new ApiError("Invalid user ID", 400);
    const addresses = await addressService.getAddressesByUserId(userid);
    if (!addresses || addresses.length === 0)
      throw new ApiError("No addresses found for this user", 404);

    reply.send({ success: true, data: addresses });
  } catch (error) {
    handleError(reply, error);
  }
};

/**
 * PUT /addresses/:id
 * body can contain any of: { street, city, state, pincode }
 */
export const updateAddress = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new ApiError("Invalid address ID", 400);

    const data: any = req.body;

    // If pincode provided, validate it
    if (data.pincode && !validatePincode(String(data.pincode))) {
      throw new ApiError("Invalid pincode format", 400);
    }

    // If user_id is being updated, verify the target user exists
    if (data.user_id !== undefined) {
      const uid = Number(data.user_id);
      if (isNaN(uid)) throw new ApiError("Invalid user_id", 400);
      const user = await User.findByPk(uid);
      if (!user) throw new ApiError("User not found for provided user_id", 404);
      data.user_id = uid;
    }

    const [updated] = await addressService.updateAddress(id, data);
    if (updated === 0) throw new ApiError("Address not found or no changes made", 404);

    reply.send({ success: true, message: "Address updated successfully" });
  } catch (error) {
    handleError(reply, error);
  }
};

/**
 * DELETE /addresses/:id
 */
export const deleteAddress = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new ApiError("Invalid address ID", 400);

    const deleted = await addressService.deleteAddress(id);
    if (deleted === 0) throw new ApiError("Address not found", 404);

    reply.send({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    handleError(reply, error);
  }
};
