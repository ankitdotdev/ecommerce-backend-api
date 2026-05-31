import z from "zod";

// GET_CART ____________________________________

export const getCartValidationSchema = z.object({});

// ADD_TO_CART ____________________________________

export const addToCartValidationSchema = z.object({
  body: z.object({
    productId: z
      .string()
      .trim()
      .min(1, "Product ID is required"),

    quantity: z.coerce
      .number()
      .int("Quantity must be a whole number")
      .min(1, "Quantity must be at least 1"),
  }),
});

// UPDATE_CART_ITEM ____________________________________

export const updateCartItemValidationSchema = z.object({
  params: z.object({
    productId: z
      .string()
      .trim()
      .min(1, "Product ID is required"),
  }),

  body: z.object({
    quantity: z.coerce
      .number()
      .int("Quantity must be a whole number")
      .min(1, "Quantity must be at least 1"),
  }),
});

// REMOVE_CART_ITEM ____________________________________

export const removeCartItemValidationSchema = z.object({
  params: z.object({
    productId: z
      .string()
      .trim()
      .min(1, "Product ID is required"),
  }),
});

// CLEAR_CART ____________________________________

export const clearCartValidationSchema = z.object({});