import { z } from "zod";



// Register 
export const registerValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters"),

    email: z
      .string()
      .email("Invalid email address"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    phone: z
      .string()
      .optional(),
  }),
});



// Verify Otp 
export const verifyOtpValidationSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Invalid email address"),

    otp: z
      .string()
      .length(6, "OTP must be 6 digits"),
  }),
});





// RESEND OTP
export const resendOtpValidationSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Invalid email address"),
  }),
});