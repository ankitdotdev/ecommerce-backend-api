import { User } from "./user.model";
import { NotFoundError } from "../../utils/errors/AppError";

class UserServices {
  // GET_ME ____________________________________
  //
  // Edge Cases Covered:
  // - User does not exist
  // - User is soft deleted

  async getMe(userId: string) {
    const user = await User.findById(userId)
      .select(
        "-password -otp -otpExpiresAt -resetToken -resetTokenExpiresAt -refreshToken -refreshTokenExpiresAt",
      )
      .lean();

    if (!user || user.isDeleted) {
      throw new NotFoundError("User not found");
    }

    return user;
  }
}

export default new UserServices();
