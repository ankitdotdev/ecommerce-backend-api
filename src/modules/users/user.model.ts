import { Schema, model } from "mongoose";

import { IUser, UserModel } from "./user.interface";

const userSchema = new Schema<IUser, UserModel>(
  {
    // Basic Info
    name: {
      type: String,

      required: true,

      trim: true,
    },

    email: {
      type: String,

      required: true,

      unique: true,

      lowercase: true,

      trim: true,
    },

    password: {
      type: String,

      required: true,

      select: false,
    },

    phone: {
      type: String,
    },

    dateOfBirth: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    avatar: {
      type: String,
    },

    // Authorization
    role: {
      type: String,

      enum: ["admin", "customer"],

      default: "customer",
    },

    status: {
      type: String,

      enum: ["active", "blocked", "inactive"],

      default: "active",
    },

    // Verification
    isEmailVerified: {
      type: Boolean,

      default: false,
    },

    emailVerifiedAt: {
      type: Date,
    },

    otp: {
      type: String,
    },

    otpExpiresAt: {
      type: Date,
    },

    // Security
    lastLoginAt: {
      type: Date,
    },

    resetToken: {
      type: String,
    },

    resetTokenExpiresAt: {
      type: Date,
    },

    passwordChangedAt: {
      type: Date,
    },

    refreshToken: {
      type: String,
    },

    refreshTokenExpiresAt: {
      type: Date,
    },

    blockedAt: {
      type: Date,
    },

    blockedReason: {
      type: String,

      trim: true,
    },

    // Soft Delete
    isDeleted: {
      type: Boolean,

      default: false,
    },

    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const User = model<IUser, UserModel>("User", userSchema);
