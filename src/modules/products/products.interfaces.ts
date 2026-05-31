import { ObjectId } from "mongoose";

export enum ProductStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IProduct {
  name: string;
  slug: string;
  description: string;

  price: number;
  stock: number;

  images: string[];
  thumbnailIndex?: number;

  category: string;

  status: ProductStatus;

  tags: string[];

  createdBy: ObjectId | string;
  updatedBy?: ObjectId | string;

  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: ObjectId | string;
  deleteReason?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
