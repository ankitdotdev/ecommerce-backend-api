import { BadRequestError, NotFoundError } from "../../../utils/errors/AppError";
import { User } from "../../users/user.model";

class UserServices {
  // GET_USERS ____________________________________
  //
  // Edge Cases Covered:
  // - Invalid pagination values
  // - No users found
  // - Search by name/email
  // - Filter by role
  // - Filter by status
  // - Soft deleted users excluded

  async getUsers(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: "active" | "blocked" | "inactive";
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {
      isDeleted: false,
      role: "customer",
    };

    if (query.status) {
      filter.status = query.status;
    }

    if (query.search) {
      filter.$or = [
        {
          name: {
            $regex: query.search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: query.search,
            $options: "i",
          },
        },
      ];
    }

    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder === "asc" ? 1 : -1;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select(
          "-password -otp -otpExpiresAt -resetToken -resetTokenExpiresAt -refreshToken -refreshTokenExpiresAt",
        )
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),

      User.countDocuments(filter),
    ]);

    return {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: users,
    };
  }

  // GET_USER_BY_ID ____________________________________
  //
  // Edge Cases Covered:
  // - User does not exist
  // - User is soft deleted

  async getUserById(userId: string) {
    const user = await User.findOne({
      _id: userId,
      isDeleted: false,
    }).select(
      "-password -otp -otpExpiresAt -resetToken -resetTokenExpiresAt -refreshToken -refreshTokenExpiresAt",
    );

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  // BLOCK_USER ____________________________________
  //
  // Edge Cases Covered:
  // - User does not exist
  // - User already blocked
  // - User already deleted
  // - Admin trying to block another admin

  async blockUser(userId: string, reason: string) {
    const user = await User.findById(userId);

    if (!user || user.isDeleted) {
      throw new NotFoundError("User not found");
    }

    if (user.role === "admin") {
      throw new BadRequestError("Admin accounts cannot be blocked");
    }

    if (user.status === "blocked") {
      throw new BadRequestError("User account is already blocked");
    }

    user.status = "blocked";
    user.blockedAt = new Date();
    user.blockedReason = reason;

    await user.save();

    return {
      id: user._id,
      status: user.status,
      blockedAt: user.blockedAt,
      blockedReason: user.blockedReason,
    };
  }

  // UNBLOCK_USER ____________________________________
  //
  // Edge Cases Covered:
  // - User does not exist
  // - User already active
  // - User deleted

  async unblockUser(userId: string) {
    const user = await User.findById(userId);

    if (!user || user.isDeleted) {
      throw new NotFoundError("User not found");
    }

    if (user.status !== "blocked") {
      throw new BadRequestError("User account is not blocked");
    }

    user.status = "active";
    user.blockedAt = undefined;
    user.blockedReason = undefined;

    await user.save();

    return {
      id: user._id,
      status: user.status,
    };
  }

  // GET_USER_STATS ____________________________________
  //
  // Edge Cases Covered:
  // - No users present

  async getUserStats() {
    const [
      totalUsers,
      activeUsers,
      blockedUsers,
      inactiveUsers,
      verifiedUsers,
      unverifiedUsers,
      deletedUsers,
    ] = await Promise.all([
      User.countDocuments({
        isDeleted: false,
      }),

      User.countDocuments({
        isDeleted: false,
        status: "active",
      }),

      User.countDocuments({
        isDeleted: false,
        status: "blocked",
      }),

      User.countDocuments({
        isDeleted: false,
        status: "inactive",
      }),

      User.countDocuments({
        isDeleted: false,
        isEmailVerified: true,
      }),

      User.countDocuments({
        isDeleted: false,
        isEmailVerified: false,
      }),
      User.countDocuments({
        isDeleted: true,
      }),
    ]);

    return {
      totalUsers,
      activeUsers,
      blockedUsers,
      inactiveUsers,
      verifiedUsers,
      unverifiedUsers,
      deletedUsers
    };
  }
}

export default new UserServices();
