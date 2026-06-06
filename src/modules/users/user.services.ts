import { User } from "./user.model";
import { BadRequestError, NotFoundError } from "../../utils/errors/AppError";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/upload/cloudinary";
import { Order } from "../orders/orders.model";

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

  // UPDATE_ME ____________________________________
  //
  // Edge Cases Covered:
  // - User does not exist
  // - User is deleted
  // - Empty update payload

  async updateMe(
    userId: string,
    payload: {
      name?: string;
      phone?: string;
      gender?: "male" | "female" | "other";
      dateOfBirth?: Date;
    },
  ) {
    if (Object.keys(payload).length === 0) {
      throw new BadRequestError("At least one field is required for update");
    }

    const user = await User.findById(userId);

    if (!user || user.isDeleted) {
      throw new NotFoundError("User not found");
    }

    const updateData: Record<string, unknown> = {};

    if (payload.name !== undefined) {
      updateData.name = payload.name;
    }

    if (payload.phone !== undefined) {
      updateData.phone = payload.phone;
    }

    if (payload.gender !== undefined) {
      updateData.gender = payload.gender;
    }

    if (payload.dateOfBirth !== undefined) {
      updateData.dateOfBirth = payload.dateOfBirth;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select(
      "-password -otp -otpExpiresAt -resetToken -resetTokenExpiresAt -refreshToken -refreshTokenExpiresAt",
    );

    return updatedUser;
  }

  // UPDATE_AVATAR ____________________________________
  //
  // Edge Cases Covered:
  // - User does not exist
  // - User is deleted
  // - Avatar file missing
  // - Previous avatar cleanup

  async updateAvatar(userId: string, file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestError("Avatar file is required");
    }

    const user = await User.findById(userId);

    if (!user || user.isDeleted) {
      throw new NotFoundError("User not found");
    }

    const oldAvatar = user.avatar;

    const uploadedFile = await uploadToCloudinary(
      file.buffer,
      "watersports/users/avatars",
    );

    user.avatar = uploadedFile.secure_url;

    await user.save();
    if (oldAvatar) {
      try {
        const deleted = await deleteFromCloudinary(oldAvatar);

        if (!deleted) {
          console.warn(`Avatar cleanup skipped for user ${user._id}`);
        }
      } catch (error) {
        console.error("AVATAR_DELETE_ERROR:", error);
      }
    }

    return {
      avatar: user.avatar,
    };
  }

  // DELETE_AVATAR ____________________________________
  //
  // Edge Cases Covered:
  // - User does not exist
  // - User is deleted
  // - User has no avatar
  // - Cloudinary deletion failure

  async deleteAvatar(userId: string) {
    const user = await User.findById(userId);

    if (!user || user.isDeleted) {
      throw new NotFoundError("User not found");
    }

    if (!user.avatar) {
      throw new BadRequestError("No profile picture found");
    }

    const avatarUrl = user.avatar;

    user.avatar = undefined;

    await user.save();

    try {
      await deleteFromCloudinary(avatarUrl);
    } catch (error) {
      console.error("AVATAR_DELETE_ERROR:", error);
    }

    return {
      avatar: null,
    };
  }

  // DELETE_ME ____________________________________
  //
  // Edge Cases Covered:
  // - User does not exist
  // - User already deleted
  // - User has active orders
  // - Avatar cleanup failure

  async deleteMe(userId: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.isDeleted) {
      throw new BadRequestError("Account has already been deleted");
    }

    const activeOrder = await Order.exists({
      user: user._id,
      orderStatus: {
        $in: ["pending", "confirmed", "processing", "shipped"],
      },
    });

    if (activeOrder) {
      throw new BadRequestError(
        "Cannot delete account while active orders exist",
      );
    }

    // Soft delete user
    user.isDeleted = true;
    user.deletedAt = new Date();
    user.status = "inactive";

    // Invalidate active sessions
    user.refreshToken = undefined;
    user.refreshTokenExpiresAt = undefined;

    await user.save();

    if (user.avatar) {
      try {
        await deleteFromCloudinary(user.avatar);
      } catch (error) {
        console.error("AVATAR_DELETE_ERROR:", error);
      }
    }

    return {
      deleted: true,
      deletedAt: user.deletedAt,
    };
  }
}

export default new UserServices();
