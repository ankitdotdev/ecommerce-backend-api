



import z from "zod";

// GET_ALL_ORDERS_QUERY ________________________________________________________________

export const getAllOrdersQueryValidationSchema = z.object({
  query: z.object({
    page: z.coerce.number().positive().optional(),

    limit: z.coerce.number().positive().optional(),

    search: z.string().optional(),

    orderStatus: z
      .enum([
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ])
      .optional(),

    paymentStatus: z
      .enum([
        "pending",
        "paid",
        "failed",
        "refunded",
      ])
      .optional(),
  }),
});

// ORDER_PARAMS ________________________________________________________________

export const adminOrderParamsValidationSchema = z.object({
  params: z.object({
    orderId: z
      .string()
      .min(1, "Order ID is required"),
  }),
});

// UPDATE_ORDER_STATUS ________________________________________________________________

export const updateOrderStatusValidationSchema = z.object({
  body: z.object({
    orderStatus: z.enum([
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ]),
  }),
});
