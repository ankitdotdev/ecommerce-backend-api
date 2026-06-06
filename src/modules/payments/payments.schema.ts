import z from "zod";

// INITIATE_PAYMENT ____________________________________

export const initiatePaymentValidationSchema = z.object({
  params: z.object({
    orderId: z.string().trim().min(1, "Order ID is required"),
  }),
});


// VERIFY_PAYMENT ____________________________________

export const verifyPaymentValidationSchema = z.object({
  body: z.object({
    orderId: z.string().trim().min(1, "Order ID is required"),
    razorpayOrderId: z
      .string()
      .trim()
      .min(1, "Razorpay Order ID is required"),
    razorpayPaymentId: z
      .string()
      .trim()
      .min(1, "Razorpay Payment ID is required"),
    razorpaySignature: z
      .string()
      .trim()
      .min(1, "Razorpay Signature is required"),
  }),
});


// GET_PAYMENT ____________________________________

export const getPaymentValidationSchema = z.object({
  params: z.object({
    paymentId: z.string().trim().min(1, "Payment ID is required"),
  }),
});