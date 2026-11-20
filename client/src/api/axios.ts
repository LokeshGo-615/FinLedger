import axios from "axios";

import type {
  InternalAxiosRequestConfig,
} from "axios";

import { env } from "../config/env";
import { tokenManager } from "./tokenManager";
import { refreshAccessToken } from "./refresh";

interface RetryConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
  timeout: 15000,

  headers: {
    "Content-Type": "application/json",
  },
});

let onSessionExpired: (() => void) | null = null;

export function setSessionExpiredHandler(
  handler: () => void
) {
  onSessionExpired = handler;
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest =
      error.config as RetryConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const excludedRoutes = [
      "/auth/login",
      "/auth/register",
      "/auth/refresh",
      "/auth/logout",
    ];

    const isExcluded = excludedRoutes.some(
      (route) => originalRequest.url === route
    );

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isExcluded ||
      !tokenManager.getToken()
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const currentToken = tokenManager.getToken();

      const previousToken =
        originalRequest.headers.get("Authorization");

      // Another request may have already refreshed the token.
      const accessToken =
        currentToken &&
        previousToken !== `Bearer ${currentToken}`
          ? currentToken
          : await refreshAccessToken();

      originalRequest.headers.Authorization =
        `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      if (
        axios.isAxiosError(refreshError) &&
        refreshError.response?.status === 401
      ) {
        tokenManager.clearToken();

        onSessionExpired?.();
      }

      return Promise.reject(refreshError);
    }
  }
);