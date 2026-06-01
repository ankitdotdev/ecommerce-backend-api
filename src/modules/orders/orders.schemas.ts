import z from "zod";

// CREATE_ORDER ________________________________________________________________

export const createOrderValidationSchema = z.object({
  body: z.object({
    addressId: z
      .string()
      .min(1, "Address ID is required"),
  }),
});

// ORDER_PARAMS ________________________________________________________________

export const orderParamsValidationSchema = z.object({
  params: z.object({
    orderId: z
      .string()
      .min(1, "Order ID is required"),
  }),
});