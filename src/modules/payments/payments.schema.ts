import z from "zod";

// INITIATE_PAYMENT ____________________________________

export const initiatePaymentValidationSchema = z.object({
  params: z.object({
    orderId: z.string().trim().min(1, "Order ID is required"),
  }),
});