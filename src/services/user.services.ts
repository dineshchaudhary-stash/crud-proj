import { User } from "../models/user.model.js";
import { Address } from "../models/address.model.js";
export const findUserByEmail = async (email: string) => {
  return await User.findOne({ where: { email } });
};
export const createUser = async (data: any) => await User.create(data);
export const getAllUsers = async () => await User.findAll ({ include: ["addresses"]})  ; 
export async function getUsersWithoutAddresses() {
  // Users WITHOUT addresses
  return User.findAll({
    include: [
      {
        model: Address,
        as: "addresses",
        required: false, // include even if no address
        attributes: [],  // don’t fetch address columns
      },
    ],
    where: {
      "$Addresses.id$": null, // filter: only users with no related addresses
    },
  });
}

export const getUserById = async (id: number) => await User.findByPk(id, { include: ["addresses"]  });
// ✅ Get only users (no addresses)
export async function getUsersOnly() {
  return User.findAll({
    attributes: ["id", "first_name", "last_name", "email", "createdAt", "updatedAt"],
  });
}

export const updateUser = async (id: number, data: any) => await User.update(data, { where: { id } });
export const deleteUser = async (id: number) => await User.destroy({ where: { id } });

export const getAddressByIdpincode = async (pincode: string) => {
  return await Address.findAll({ where: { pincode } });
};
