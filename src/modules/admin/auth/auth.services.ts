import { generateAccessToken, generateRefreshToken } from "../../../utils/jwt";
import { UserRole } from "../../user/user.interface";
import { User } from "../../user/user.model";
import argon2 from "argon2";

class AuthService {
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

    const isPasswordMatched = await argon2.verify(
      user.password,
      payload.password,
    );

    if (!isPasswordMatched) {
      throw new Error("Invalid credentials");
    }

    console.log("Role checked", UserRole.ADMIN);

    if (user.role !== UserRole.ADMIN) {
      throw new Error("Admin access required");
    }

    console.log("STEP 3: Password verified");

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
