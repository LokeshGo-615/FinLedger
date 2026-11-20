import { api } from "./axios";

import type { ApiResponse } from "../types/api.types";

import type {
  User,
  LoginPayload,
  RegisterPayload,
  LoginResponse,
  RefreshResponse,
  UserRole,
  UserStatus,
} from "../types/auth.types";

type UserDocument = {
  _id?: string;
  id?: string;
  fullName: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
  createdAt?: string;
  updatedAt?: string;
};

export const authApi = {

  // Register new user
  async register(payload: RegisterPayload) {
    const response = await api.post<ApiResponse<User>>(
      "/auth/register",
      payload
    );

    return response.data.data;
  },

  // Login user
  async login(payload: LoginPayload) {
    const response = await api.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      payload
    );

    return response.data.data;
  },

  // Refresh access token
  async refresh() {
    const response = await api.post<ApiResponse<RefreshResponse>>(
      "/auth/refresh"
    );

    return response.data.data;
  },

  // Logout user
  async logout() {
    const response = await api.post<ApiResponse<null>>(
      "/auth/logout"
    );

    return response.data;
  },

  // Get current authenticated user
  async getMe(): Promise<User> {
    const response = await api.get<ApiResponse<UserDocument>>(
      "/auth/me"
    );

    const user = response.data.data;
    const id = user.id ?? user._id;

    if (!id) {
      throw new Error("Invalid user response");
    }

    return {
      id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },
};