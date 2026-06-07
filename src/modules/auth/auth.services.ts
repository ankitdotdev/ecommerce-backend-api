import argon2 from "argon2";
import { IUser, UserRole, UserStatus } from "../users/user.interface";
import { User } from "../users/user.model";
import authEmailServices from "../../services/email/modules/auth/auth-email.services";
import { v4 as uuidv4 } from "uuid";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import jwt from "jsonwebtoken";
import { config } from "../../config";
import { UnauthorizedError } from "../../utils/errors/AppError";
class AuthService {
  async registerUser(payload: Partial<IUser>) {
    console.log("STEP 1: Register started");

    // check existing user
    const existingUser = await User.findOne({
      email: payload.email,
    });

    console.log("STEP 2: Existing user check completed");

    // already verified user
    if (existingUser && existingUser.isEmailVerified) {
      console.log("STEP 3: Verified user already exists");

      throw new Error("User already exists");
    }

    console.log("STEP 4: Hashing password");

    // hash password
    const hashedPassword = await argon2.hash(payload.password as string);

    console.log("STEP 5: Password hashed");

    // generate otp
    const otp = authEmailServices.generateOtp();

    console.log("STEP 6: OTP generated", otp);

    // generate otp expiry
    const otpExpiresAt = authEmailServices.generateOtpExpiry();

    console.log("STEP 7: OTP expiry generated");

    // existing unverified user
    if (existingUser && !existingUser.isEmailVerified) {
      console.log("STEP 8: Updating existing unverified user");

      existingUser.name = payload.name as string;

      existingUser.password = hashedPassword;

      existingUser.phone = payload.phone;

      existingUser.otp = otp;

      existingUser.otpExpiresAt = otpExpiresAt;

      await existingUser.save();

      console.log("STEP 9: Existing user updated");

      await authEmailServices.sendVerificationOtp(existingUser.email, otp);

      console.log("STEP 10: Verification email sent");

      return existingUser;
    }

    console.log("STEP 11: Creating new user");

    // create new user
    const user = await User.create({
      ...payload,

      password: hashedPassword,

      otp,

      otpExpiresAt,
    });

    console.log("STEP 12: User created");

    // send welcome email
    await authEmailServices.sendWelcomeEmail(
      user.email,
      user.name,
      config.companyName,
    );

    // send verification email
    await authEmailServices.sendVerificationOtp(user.email, otp);

    console.log("STEP 13: Verification email sent and W elcome email");

    return user;
  }

  // VERIFY OTP SERVICE LOGIN
  async verifyOtp(email: string, otp: string) {
    console.log("STEP 1: OTP verification started");

    // find user
    const user = await User.findOne({
      email,
    });

    console.log("STEP 2: User lookup completed");

    // user not found
    if (!user) {
      console.log("STEP 3: User not found");

      throw new Error("User not found");
    }

    // already verified
    if (user.isEmailVerified) {
      console.log("STEP 4: Email already verified");

      throw new Error("Email already verified");
    }

    console.log("STEP 5: Checking OTP");

    // invalid otp
    if (user.otp !== otp) {
      console.log("STEP 6: Invalid OTP");

      throw new Error("Invalid OTP");
    }

    console.log("STEP 7: OTP matched");

    // expired otp
    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      console.log("STEP 8: OTP expired");

      throw new Error("OTP expired");
    }

    console.log("STEP 9: OTP expiry validated");

    // update verification status
    user.set({
      isEmailVerified: true,

      emailVerifiedAt: new Date(),

      otp: null,

      otpExpiresAt: null,
    });

    console.log("STEP 10: Verification fields updated");

    // save updated user
    await user.save();

    console.log("STEP 11: User verification saved");

    return user;
  }

  // RESEND OTP___________________________________________
  async resendOtp(email: string) {
    console.log("STEP 1: Resend OTP started");

    // check user exists
    const user = await User.findOne({
      email,
    });

    console.log("STEP 2: User lookup completed");

    // user not found
    if (!user) {
      console.log("STEP 3: User not found");

      throw new Error("User not found");
    }

    // already verified
    if (user.isEmailVerified) {
      console.log("STEP 4: Email already verified");

      throw new Error("Email already verified");
    }

    console.log("STEP 5: Generating new OTP");

    // generate otp
    const otp = authEmailServices.generateOtp();

    // generate expiry
    const otpExpiresAt = authEmailServices.generateOtpExpiry();

    console.log("STEP 6: OTP generated");

    // update otp
    user.set({
      otp,
      otpExpiresAt,
    });

    console.log("STEP 7: OTP fields updated");

    // save user
    await user.save();

    console.log("STEP 8: OTP saved");

    // send verification email
    await authEmailServices.sendVerificationOtp(user.email, otp);

    console.log("STEP 9: Verification email sent");

    return null;
  }

  // LOGIN  ____________________________________________________

  async loginUser(payload: { email: string; password: string }) {
    console.log("STEP 1: Login started");

    const user = await User.findOne({
      email: payload.email,
    }).select("+password");

    console.log("STEP 2: User lookup completed");

    if (!user) {
      throw new Error("Invalid credentials");
    }

    if (!user.isEmailVerified) {
      throw new Error("Email not verified");
    }
    if (user.status === UserStatus.BLOCKED) {
      throw new UnauthorizedError(
        "Your account has been blocked. Please contact support for assistance.",
      );
    }

    const isPasswordMatched = await argon2.verify(
      user.password,
      payload.password,
    );

    if (!isPasswordMatched) {
      throw new Error("Invalid credentials");
    }

    console.log("STEP 3: Password verified");

    console.log("ROLE CHECK :", user.role);

    if (user.role !== UserRole.CUSTOMER) {
      throw new Error("Invalid credentials");
    }

    // generate access token
    const accessToken = generateAccessToken({
      userId: user._id.toString(),

      email: user.email,

      role: user.role,
    });

    // generate refresh token
    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),

      email: user.email,

      role: user.role,
    });

    console.log("STEP 4: Tokens generated");

    // save refresh token
    user.set({
      refreshToken,

      refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),

      lastLoginAt: new Date(),
    });

    await user.save();

    console.log("STEP 5: Refresh token saved");

    return {
      accessToken,

      refreshToken,
    };
  }

  // FORGOT_PASSWORD ______________________________________
  async forgotPassword(email: string) {
    console.log("STEP 1: Forgot password started");

    // find user
    const user = await User.findOne({
      email,
    });

    console.log("STEP 2: User lookup completed");

    // user not found
    if (!user) {
      console.log("STEP 3: User not found");

      throw new Error("User not found");
    }

    // email not verified
    if (!user.isEmailVerified) {
      console.log("STEP 4: Email not verified");

      throw new Error("Email not verified");
    }

    console.log("STEP 5: Generating reset OTP");

    // generate otp
    const otp = authEmailServices.generateOtp();

    // generate expiry
    const otpExpiresAt = authEmailServices.generateOtpExpiry();

    // update user
    user.set({
      otp,
      otpExpiresAt,
    });

    console.log("STEP 6: Reset OTP updated");

    // save user
    await user.save();

    console.log("STEP 7: Reset OTP saved");

    // send email
    await authEmailServices.sendForgotPasswordOtp(user.email, otp);

    console.log("STEP 8: Password reset email sent");

    return null;
  }

  // VERIFY_RESET_PASSWORD_OTP _________________________________________

  async verifyResetOtp(payload: { email: string; otp: string }) {
    console.log("STEP 1: Reset OTP verification started");

    // find user
    const user = await User.findOne({
      email: payload.email,
    });

    console.log("STEP 2: User lookup completed");

    // user not found
    if (!user) {
      throw new Error("User not found");
    }

    // invalid otp
    if (user.otp !== payload.otp) {
      throw new Error("Invalid OTP");
    }

    // expired otp
    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new Error("OTP expired");
    }

    console.log("STEP 3: OTP validated");

    // generate secure reset token
    const resetToken = uuidv4();

    // save reset token
    user.set({
      resetToken,

      resetTokenExpiresAt: new Date(Date.now() + 5 * 60 * 1000),

      otp: null,

      otpExpiresAt: null,
    });

    console.log("STEP 4: Reset token generated");

    await user.save();

    console.log("STEP 5: Reset token saved");

    return {
      resetToken,
    };
  }

  // RESET_PASSWORD _______________________________________

  async resetPassword(payload: { resetToken: string; newPassword: string }) {
    console.log("STEP 1: Reset password started");

    // missing token
    if (!payload.resetToken) {
      console.log("STEP 2: Reset token missing");

      throw new Error("Unauthorized access");
    }

    // find user
    const user = await User.findOne({
      resetToken: payload.resetToken,
    }).select("+password");

    console.log("STEP 3: User lookup completed");

    // invalid token
    if (!user) {
      console.log("STEP 4: Invalid reset token");

      throw new Error("Invalid reset token");
    }

    // token expired
    if (!user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
      console.log("STEP 5: Reset token expired");

      throw new Error("Reset token expired");
    }

    console.log("STEP 6: Reset token validated");

    // hash new password
    const hashedPassword = await argon2.hash(payload.newPassword);

    console.log("STEP 7: Password hashed");

    // update user
    user.set({
      password: hashedPassword,

      passwordChangedAt: new Date(),

      resetToken: null,

      resetTokenExpiresAt: null,
    });

    console.log("STEP 8: Password fields updated");

    // save user
    await user.save();

    console.log("STEP 9: Password reset saved");

    return null;
  }

  // CHANGE_PASSWORD _______________________________________
  async changePassword(
    userData: any,

    payload: {
      currentPassword: string;
      newPassword: string;
    },
  ) {
    console.log("STEP 1: Change password started");

    // find user
    const user = await User.findById(userData.userId).select("+password");

    console.log("STEP 2: User lookup completed");

    // user not found
    if (!user) {
      console.log("STEP 3: User not found");

      throw new Error("User not found");
    }

    console.log("STEP 4: Verifying current password");

    // compare current password
    const isPasswordMatched = await argon2.verify(
      user.password,
      payload.currentPassword,
    );

    // invalid password
    if (!isPasswordMatched) {
      console.log("STEP 5: Current password invalid");

      throw new Error("Current password is incorrect");
    }

    console.log("STEP 6: Current password verified");

    // hash new password
    const hashedPassword = await argon2.hash(payload.newPassword);

    console.log("STEP 7: New password hashed");

    // update password
    user.set({
      password: hashedPassword,

      passwordChangedAt: new Date(),
    });

    console.log("STEP 8: Password fields updated");

    // save user
    await user.save();

    console.log("STEP 9: Password updated successfully");

    return;
  }

  // REFRESH_TOKEN ________________________________________________

  async refreshToken(refreshToken: string) {
    console.log("STEP 1: Refresh token flow started");

    // missing token
    if (!refreshToken) {
      console.log("STEP 2: Refresh token missing");

      throw new Error("Unauthorized access");
    }

    console.log("STEP 3: Verifying refresh token");

    // verify token
    const decoded = jwt.verify(
      refreshToken,

      config.jwtRefreshSecret,
    ) as jwt.JwtPayload;

    console.log("STEP 4: Refresh token verified");

    // find user
    const user = await User.findById(decoded.userId);

    console.log("STEP 5: User lookup completed");

    // user not found
    if (!user) {
      console.log("STEP 6: User not found");

      throw new Error("User not found");
    }

    // validate stored refresh token
    if (user.refreshToken !== refreshToken) {
      console.log("STEP 7: Invalid refresh token");

      throw new Error("Invalid refresh token");
    }

    // refresh token expired
    if (
      !user.refreshTokenExpiresAt ||
      user.refreshTokenExpiresAt < new Date()
    ) {
      console.log("STEP 8: Refresh token expired");

      throw new Error("Refresh token expired");
    }

    console.log("STEP 9: Stored refresh token validated");

    // generate new access token
    const newAccessToken = generateAccessToken({
      userId: user._id.toString(),

      email: user.email,

      role: user.role,
    });

    console.log("STEP 10: New access token generated");

    return {
      accessToken: newAccessToken,
    };
  }

  // LOGOUT ___________________________________________________________

  async logoutUser(userData: any) {
    console.log("STEP 1: Logout started");

    // find user
    const user = await User.findById(userData.userId);

    console.log("STEP 2: User lookup completed");

    // user not found
    if (!user) {
      console.log("STEP 3: User not found");

      throw new Error("User not found");
    }

    // remove refresh token
    user.set({
      refreshToken: null,

      refreshTokenExpiresAt: null,
    });

    console.log("STEP 4: Refresh token removed");

    // save user
    await user.save();

    console.log("STEP 5: Logout saved");

    return null;
  }
}

export default new AuthService();
