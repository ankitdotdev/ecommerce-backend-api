import { Document, Types } from "mongoose";

export interface IReview extends Document {
  user: Types.ObjectId;

  product: Types.ObjectId;

  rating: number;

  title?: string;

  comment: string;

  isDeleted: boolean;

  deletedAt?: Date;

  deletedBy?: Types.ObjectId;

  deletedReason?: string;

  createdAt?: Date;

  updatedAt?: Date;
}