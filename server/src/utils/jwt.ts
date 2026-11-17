import jwt from "jsonwebtoken";
import { createHash, randomUUID } from "node:crypto";
import { env } from "../config/env.js";

export const generateAccessToken = (
  userId: string
): string => {
  return jwt.sign(
    {
      sub: userId
    },
    env.JWT_ACCESS_SECRET,
    {
      algorithm: "HS256",
      expiresIn: "15m"
    }
  );
};

export const generateRefreshToken = (
  userId: string
): string => {
  return jwt.sign(
    {
      sub: userId,
      jti: randomUUID()
    },
    env.JWT_REFRESH_SECRET,
    {
      algorithm: "HS256",
      expiresIn: "7d"
    }
  );
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(
    token,
    env.JWT_ACCESS_SECRET,
    {
      algorithms: ["HS256"]
    }
  );
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(
    token,
    env.JWT_REFRESH_SECRET,
    {
      algorithms: ["HS256"]
    }
  );
};

export const hashToken = (token: string): string => {
  return createHash("sha256")
    .update(token)
    .digest("hex");
};