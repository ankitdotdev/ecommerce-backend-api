import z from "zod";




// CREATE_PRODUCT ____________________________________

export const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2),

    description: z.string().min(10),

    price: z.number().min(0),

    stock: z.number().min(0),

    images: z.array(z.string()).min(1),

    category: z.string().min(2),

    tags: z.array(z.string()).optional(),
  }),
});