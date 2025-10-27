import { User } from "../models/user.model.js";
import { Address } from "../models/address.model.js";
export const findUserByEmail = async (email: string) => {
  return await User.findOne({ where: { email } });
};
export const createUser = async (data: any) => await User.create(data);
export const getAllUsers = async () => await User.findAll ({ include: ["addresses"]})  ; 
export const getUserById = async (id: number) => await User.findByPk(id, { include: ["addresses"]  });
export const updateUser = async (id: number, data: any) => await User.update(data, { where: { id } });
export const deleteUser = async (id: number) => await User.destroy({ where: { id } });

export const getAddressByIdpincode = async (pincode: string) => {
  return await Address.findAll({ where: { pincode } });
};
