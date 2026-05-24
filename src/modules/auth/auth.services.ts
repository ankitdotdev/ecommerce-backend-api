import argon2 from "argon2";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import authEmailServices from "../../services/email/modules/auth/auth-email.services";
import { v4 as uuidv4 } from "uuid";
import { generateToken } from "../../utils/jwt";

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

    // send verification email
    await authEmailServices.sendVerificationOtp(user.email, otp);

    console.log("STEP 13: Verification email sent");

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

    // find user with password
    const user = await User.findOne({
      email: payload.email,
    }).select("+password");

    console.log("STEP 2: User lookup completed");

    // user not found
    if (!user) {
      console.log("STEP 3: User not found");

      throw new Error("Invalid credentials");
    }

    // email not verified
    if (!user.isEmailVerified) {
      console.log("STEP 4: Email not verified");

      throw new Error("Email not verified");
    }

    // blocked/inactive
    if (user.status === "blocked" || user.status === "inactive") {
      console.log("STEP 5: Account restricted");

      throw new Error("Account access denied");
    }

    console.log("STEP 6: Verifying password");

    // verify password
    const isPasswordMatched = await argon2.verify(
      user.password,
      payload.password,
    );

    // invalid password
    if (!isPasswordMatched) {
      console.log("STEP 7: Invalid password");

      throw new Error("Invalid credentials");
    }

    console.log("STEP 8: Password verified");

    // generate access token
    const accessToken = generateToken({
      userId: user._id.toString(),

      email: user.email,

      role: user.role,
    });

    console.log("STEP 9: Access token generated");

    // update last login
    user.set({
      lastLoginAt: new Date(),
    });

    await user.save();

    console.log("STEP 10: Last login updated");

    return {
      accessToken,
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
}

export default new AuthService();
