import z from "zod";

// CREATE_PRODUCT ____________________________________

export const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Product name must be at least 2 characters"),

    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),

    price: z.number().min(0, "Price cannot be negative"),

    stock: z.number().min(0, "Stock cannot be negative"),

    images: z
      .array(z.string())
      .min(1, "At least one product image is required"),

    category: z.string().min(2, "Category must be at least 2 characters"),

    tags: z.array(z.string()).optional(),
  }),
});

// GET_ALL_PRODUCTS ___________________________________
export const getAllProductsValidationSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1, "Page number must be at least 1").optional(),

    limit: z.coerce
      .number()
      .min(1, "Limit must be at least 1")
      .max(100, "Limit cannot exceed 100")
      .optional(),

    search: z.string().optional(),

    status: z
      .string()
      .transform((value) => value.toUpperCase())
      .pipe(
        z.enum(["DRAFT", "ACTIVE", "INACTIVE"], {
          message: "Please select a valid product status",
        }),
      )
      .optional(),

    sort: z
      .string()
      .pipe(
        z.enum(["price_asc", "price_desc", "newest", "oldest"], {
          message:
            "Sort must be one of: newest, oldest, price_asc, or price_desc",
        }),
      )
      .optional(),
  }),
});
// UPDATE_PRODUCTS ___________________________________

export const updateProductValidationSchema = z.object({
  params: z.object({
    productId: z.string().min(1, "Product ID is required"),
  }),

  body: z.object({
    name: z
      .string()
      .min(2, "Product name must be at least 2 characters")
      .optional(),

    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .optional(),

    price: z.number().min(0, "Price cannot be negative").optional(),

    stock: z.number().min(0, "Stock cannot be negative").optional(),

    images: z
      .array(z.string())
      .min(1, "At least one product image is required")
      .optional(),

    category: z
      .string()
      .min(2, "Category must be at least 2 characters")
      .optional(),

    tags: z.array(z.string()).optional(),

    status: z
      .string()
      .transform((value) => value.toUpperCase())
      .pipe(
        z.enum(["DRAFT", "ACTIVE", "INACTIVE"], {
          message: "Please select a valid product status",
        }),
      )
      .optional(),
  }),
});

const objectIdRegex = /^[0-9a-fA-F]{24}$/;


// PRODUCT_ID_VALIDATION _____________________________________
export const productIdValidationSchema = z.object({
  params: z.object({
    productId: z
      .string()
      .min(1, "Product ID is required")
      .regex(objectIdRegex, "Invalid product ID"),
  }),
});


// DELETE_PRODUCT_VALIDATION _____________________________________

export const deleteProductValidationSchema = z.object({
  params: z.object({
    productId: z.string().regex(objectIdRegex, "Invalid product ID"),
  }),

  body: z.object({
    reason: z
      .string()
      .trim()
      .min(5, "Deletion reason must be at least 5 characters")
      .max(500, "Deletion reason cannot exceed 500 characters"),
  }),
});
