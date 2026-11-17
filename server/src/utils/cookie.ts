import type { CookieOptions } from "express";
import { env } from "../config/env.js";

export const REFRESH_TOKEN_COOKIE = "refreshToken";

export const REFRESH_TOKEN_TTL =
  7 * 24 * 60 * 60 * 1000;

export const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/api/v1/auth"
};