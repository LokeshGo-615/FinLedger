import jwt from "jsonwebtoken";
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

export const verifyAccessToken = (token: string) => {
  return jwt.verify(
    token,
    env.JWT_ACCESS_SECRET,
    {
      algorithms: ["HS256"]
    }
  );
};