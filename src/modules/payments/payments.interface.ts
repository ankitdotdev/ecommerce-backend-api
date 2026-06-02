import { Document, Types } from "mongoose";

export enum PaymentProvider {
  RAZORPAY = "razorpay",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export interface IPayment extends Document {
  order: Types.ObjectId;
  user: Types.ObjectId;

  amount: number;

  provider: PaymentProvider;

  status: PaymentStatus;

  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;

  paidAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}