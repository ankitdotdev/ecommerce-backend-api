import z from "zod";

// CREATE_ADDRESS ________________________________________________________________

export const createAddressValidationSchema = z.object({
  body: z.object({
    addressLine1: z
      .string()
      .trim()
      .min(1, "Address line 1 is required"),

    addressLine2: z.string().trim().optional(),

    landmark: z.string().trim().optional(),

    city: z
      .string()
      .trim()
      .min(1, "City is required"),

    state: z
      .string()
      .trim()
      .min(1, "State is required"),

    country: z
      .string()
      .trim()
      .min(1, "Country is required"),

    postalCode: z
      .string()
      .trim()
      .min(1, "Postal code is required"),

    latitude: z
      .number()
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90")
      .optional(),

    longitude: z
      .number()
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180")
      .optional(),

    isDefault: z.boolean().optional(),
  }),
});

// UPDATE_ADDRESS ________________________________________________________________

export const updateAddressValidationSchema = z.object({
  body: z.object({
    addressLine1: z.string().trim().optional(),

    addressLine2: z.string().trim().optional(),

    landmark: z.string().trim().optional(),

    city: z.string().trim().optional(),

    state: z.string().trim().optional(),

    country: z.string().trim().optional(),

    postalCode: z.string().trim().optional(),

    latitude: z
      .number()
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90")
      .optional(),

    longitude: z
      .number()
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180")
      .optional(),

    isDefault: z.boolean().optional(),
  }),
});

// ADDRESS_PARAMS ________________________________________________________________

export const addressParamsValidationSchema = z.object({
  params: z.object({
    addressId: z.string().min(1, "Address ID is required"),
  }),
});