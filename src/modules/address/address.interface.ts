import { Types } from "mongoose";

export interface IAddress {
  user: Types.ObjectId;

  addressLine1: string;
  addressLine2?: string;
  landmark?: string;

  city: string;
  state: string;
  country: string;
  postalCode: string;

  latitude?: number;
  longitude?: number;

  isDefault: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}