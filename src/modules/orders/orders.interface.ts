import { Types } from "mongoose";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface IOrderItem {
  product: Types.ObjectId;

  name: string;

  slug: string;

  image: string;

  price: number;

  quantity: number;

  subtotal: number;
}

export interface IShippingAddress {
  addressLine1: string;

  addressLine2?: string;

  landmark?: string;

  city: string;

  state: string;

  country: string;

  postalCode: string;

  latitude?: number;

  longitude?: number;
}

export interface IOrder {
  user: Types.ObjectId;

  orderNumber: string;

  items: IOrderItem[];

  shippingAddress: IShippingAddress;

  subtotal: number;

  totalAmount: number;

  orderStatus: OrderStatus;

  paymentStatus: PaymentStatus;

  createdAt?: Date;

  updatedAt?: Date;
}
