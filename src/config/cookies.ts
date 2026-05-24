import { CookieOptions } from "express";

export const accessTokenCookieOptions: CookieOptions = {
  httpOnly: true,

  secure: false,

  sameSite: "strict",

  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const resetTokenCookieOptions: CookieOptions = {
  httpOnly: true,

  secure: false,

  sameSite: "strict",

  maxAge: 5 * 60 * 1000,
};
