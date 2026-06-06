import { Schema, model } from "mongoose";
import { IPayment, PaymentProvider, PaymentStatus } from "./payments.interface";


const paymentSchema = new Schema<IPayment>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    provider: {
      type: String,
      enum: Object.values(PaymentProvider),
      default: PaymentProvider.RAZORPAY,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      required: true,
      index: true,
    },

    razorpayOrderId: {
      type: String,
      trim: true,
      sparse: true,
    },

    razorpayPaymentId: {
      type: String,
      trim: true,
      sparse: true,
    },

    razorpaySignature: {
      type: String,
      trim: true,
    },

    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Payment = model<IPayment>(
  "Payment",
  paymentSchema,
);

export default Payment;