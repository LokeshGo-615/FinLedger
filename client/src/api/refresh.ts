import axios from "axios";
import { env } from "../config/env";
import { tokenManager } from "./tokenManager";

import type { ApiResponse } from "../types/api.types";
import type { RefreshResponse } from "../types/auth.types";

const refreshClient = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
  timeout: 15000,
});

let refreshPromise: Promise<string> | null = null;

export function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<ApiResponse<RefreshResponse>>("/auth/refresh")
      .then((response) => {
        const accessToken =
          response.data.data.accessToken;

        tokenManager.setToken(accessToken);

        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}