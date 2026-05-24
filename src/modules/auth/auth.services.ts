import argon2 from "argon2";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import authEmailServices from "../../services/email/modules/auth/auth-email.services";

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
}

export default new AuthService();
