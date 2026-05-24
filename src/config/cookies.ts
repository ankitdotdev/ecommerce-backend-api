import { CookieOptions } from "express";

export const resetTokenCookieOptions: CookieOptions =
  {
    httpOnly: true,

    secure: false,

    sameSite: "strict",

    maxAge: 5 * 60 * 1000,
  };