import argon2 from "argon2";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";


class AuthService {

  async registerUser(payload: Partial<IUser>) {

    // check existing user
    const isUserExists = await User.findOne({
      email: payload.email,
    });

    if (isUserExists) {
      throw new Error("User already exists");
    }

    // hash password
    const hashedPassword = await argon2.hash(
      payload.password as string
    );

    // prepare user data
    const userData = {
      ...payload,
      password: hashedPassword,
    };

    // create user
    const user = await User.create(userData);

    return user;
  }

}

export default new AuthService();