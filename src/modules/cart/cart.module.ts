import { Schema, model } from "mongoose";
import { ICart, ICartItem } from "./cart.interfaces";


const cartItemSchema = new Schema<ICartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,

      ref: "Product",

      required: true,
    },

    quantity: {
      type: Number,

      required: true,

      min: 1,
    },
  },
  {
    _id: false,
  },
);

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,

      ref: "User",

      required: true,

      unique: true,
    },

    items: {
      type: [cartItemSchema],

      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const Cart = model<ICart>("Cart", cartSchema);