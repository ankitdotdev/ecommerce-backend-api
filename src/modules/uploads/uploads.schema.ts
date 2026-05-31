import z from "zod";


// DELETE_IMAGE_VALIDATION
export const deleteImageValidationSchema = z.object({
  body: z.object({
    imageUrl: z
      .url("Please provide a valid image URL")
      .min(1, "Image URL is required"),
  }),
});