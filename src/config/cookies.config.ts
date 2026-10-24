import { CookieOptions } from "express";

const isProd = process.env.NODE_ENV === "production";

// En local (http), secure doit etre false et sameSite "lax" (front et back sur localhost)
const cookiesBaseOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

export const accessCookiesOptions: CookieOptions = {
  ...cookiesBaseOptions,
  path: "/",
  maxAge: 2460 * 60, // 24h
};

export const refreshCookiesOptions: CookieOptions = {
  ...cookiesBaseOptions,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
};
