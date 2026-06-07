import z from "zod";

// ADD_TO_WISHLIST ____________________________________

export const addToWishlistValidationSchema = z.object({
  params: z.object({
    productId: z.string().trim().min(1, "Product ID is required"),
  }),
});

// GET_WISHLIST ____________________________________

export const getWishlistValidationSchema = z.object({
  query: z.object({}),
});

// REMOVE_FROM_WISHLIST ____________________________________

export const removeFromWishlistValidationSchema = z.object({
  params: z.object({
    productId: z.string().trim().min(1, "Product ID is required"),
  }),
});

// CLEAR_WISHLIST ____________________________________

export const clearWishlistValidationSchema = z.object({
  query: z.object({}),
});