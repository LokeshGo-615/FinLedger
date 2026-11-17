import bcrypt from "bcrypt";

import { User } from "../users/user.model.js";
import { UserStatus } from "../users/user.types.js";

import { ApiError } from "../../utils/ApiError.js";
import {
  generateAccessToken
} from "../../utils/jwt.js";

import type {
  RegisterInput,
  LoginInput
} from "./auth.validation.js";

export const registerUser = async (
  input: RegisterInput
) => {
  const existingUser = await User.findOne({
    email: input.email
  });

  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  const hashedPassword = await bcrypt.hash(
    input.password,
    12
  );

  const user = await User.create({
    fullName: input.fullName,
    email: input.email,
    password: hashedPassword
  });

  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    role: user.role
  };
};

export const loginUser = async (
  input: LoginInput
) => {
  const user = await User.findOne({
    email: input.email
  }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(
    input.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new ApiError(403, "Account is suspended");
  }

  const accessToken = generateAccessToken(
    user._id.toString()
  );

  return {
    accessToken,
    user: {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role
    }
  };
};