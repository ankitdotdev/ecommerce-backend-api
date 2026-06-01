import { NotFoundError } from "../../utils/errors/AppError";
import { Address } from "./address.model";

class AddressServices {
  // CREATE_ADDRESS ________________________________________________________________

  async createAddress(userId: string, payload: any) {
    if (payload.isDefault) {
      await Address.updateMany({ user: userId }, { isDefault: false });
    }

    const address = await Address.create({
      ...payload,
      user: userId,
    });

    return address;
  }

  // GET_ADDRESSES ________________________________________________________________

  async getAddresses(userId: string) {
    const addresses = await Address.find({
      user: userId,
    }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    return addresses;
  }

  // GET_ADDRESS ________________________________________________________________

  async getAddress(userId: string, addressId: string) {
    const address = await Address.findOne({
      _id: addressId,
      user: userId,
    });

    if (!address) {
      throw new NotFoundError("Address not found");
    }

    return address;
  }

  // UPDATE_ADDRESS ________________________________________________________________

  async updateAddress(userId: string, addressId: string, payload: any) {
    const existingAddress = await Address.findOne({
      _id: addressId,
      user: userId,
    });

    if (!existingAddress) {
      throw new NotFoundError("Address not found");
    }

    if (payload.isDefault) {
      await Address.updateMany({ user: userId }, { isDefault: false });
    }

    const updatedAddress = await Address.findByIdAndUpdate(addressId, payload, {
      new: true,
      runValidators: true,
    });

    return updatedAddress;
  }

  // DELETE_ADDRESS ________________________________________________________________

  async deleteAddress(userId: string, addressId: string) {
    const address = await Address.findOne({
      _id: addressId,
      user: userId,
    });

    if (!address) {
      throw new NotFoundError("Address not found");
    }

    const wasDefault = address.isDefault;

    await Address.findByIdAndDelete(addressId);

    if (wasDefault) {
      const nextAddress = await Address.findOne({
        user: userId,
      }).sort({ createdAt: -1 });

      if (nextAddress) {
        nextAddress.isDefault = true;
        await nextAddress.save();
      }
    }

    return null;
  }
}

export default new AddressServices();
