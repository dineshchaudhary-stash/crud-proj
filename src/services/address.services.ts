import { Address } from "../models/address.model.js";
import { Op } from  "sequelize";

export const createAddress = async (data: any) => await Address.create(data);

export const getAllAddresses = async (pincode?: string) => {
  if (pincode) return await Address.findAll({ where: { pincode } });
  return await Address.findAll();
};

export const getAddressById = async (id: number) => await Address.findByPk(id);
export const getAddressesByUserId = async (userId: number) => {
  return await Address.findAll({ where: { userId } });
};

export const updateAddress = async (id: number, data: any) => await Address.update(data, { where: { id } });
export const deleteAddress = async (id: number) => await Address.destroy({ where: { id } });
