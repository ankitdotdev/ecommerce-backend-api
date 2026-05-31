import { Model } from "mongoose";

export type UserRole = "admin" | "customer";

export type UserStatus = "active" | "blocked" | "inactive";

export interface IUser {
  // Basic Info
  name: string;

  email: string;

  password: string;

  phone?: string;

  avatar?: string;

  // Authorization
  role: UserRole;

  status: UserStatus;

  // Verification
  isEmailVerified: boolean;

  emailVerifiedAt?: Date;

  otp?: string;

  otpExpiresAt?: Date;

  // Security
  lastLoginAt?: Date;

  refreshToken?: string;

  refreshTokenExpiresAt?: Date;

  resetToken?: string;

  resetTokenExpiresAt?: Date;

  passwordChangedAt?: Date;

  blockedAt?: Date;

  blockedReason?: string;

  // Soft Delete
  isDeleted: boolean;

  deletedAt?: Date;

  // Timestamps
  createdAt?: Date;

  updatedAt?: Date;
}

export const UserRole = {
  ADMIN: "admin",
  CUSTOMER: "customer",
};
export interface UserModel extends Model<IUser> {}
