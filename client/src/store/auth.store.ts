import { create } from "zustand";
import axios from "axios";

import { authApi } from "../api/auth.api";
import { tokenManager } from "../api/tokenManager";
import { refreshAccessToken } from "../api/refresh";
import { getApiErrorMessage } from "../utils/apiError";

import type {
  User,
  LoginPayload,
  RegisterPayload,
} from "../types/auth.types";

interface AuthState {
  user: User | null;

  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  error: string | null;

  login: (payload: LoginPayload) => Promise<void>;

  register: (
    payload: RegisterPayload
  ) => Promise<void>;

  logout: () => Promise<void>;

  initialize: () => Promise<void>;

  clearError: () => void;

  clearSession: () => void;
}

export const useAuthStore = create<AuthState>(
  (set, get) => ({
    user: null,

    isAuthenticated: false,
    isLoading: false,
    isInitialized: false,

    error: null,

    // Login
    login: async (payload) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        const data = await authApi.login(payload);

        tokenManager.setToken(data.accessToken);

        set({
          user: data.user,
          isAuthenticated: true,
        });
      } catch (error) {
        set({
          error: getApiErrorMessage(error),
        });

        throw error;
      } finally {
        set({
          isLoading: false,
        });
      }
    },

    // Register
    register: async (payload) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        await authApi.register(payload);
      } catch (error) {
        set({
          error: getApiErrorMessage(error),
        });

        throw error;
      } finally {
        set({
          isLoading: false,
        });
      }
    },

    // Logout
    logout: async () => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        await authApi.logout();

        get().clearSession();
      } catch (error) {
        set({
          error: getApiErrorMessage(error),
        });

        throw error;
      } finally {
        set({
          isLoading: false,
        });
      }
    },

    // Restore existing session
    initialize: async () => {
      if (get().isInitialized || get().isLoading) {
        return;
      }

      set({
        isLoading: true,
        error: null,
      });

      try {
        await refreshAccessToken();

        const user = await authApi.getMe();

        set({
          user,
          isAuthenticated: true,
        });
      } catch (error) {
        get().clearSession();

        if (
          !axios.isAxiosError(error) ||
          error.response?.status !== 401
        ) {
          set({
            error: getApiErrorMessage(error),
          });
        }
      } finally {
        set({
          isLoading: false,
          isInitialized: true,
        });
      }
    },

    // Clear authentication session
    clearSession: () => {
      tokenManager.clearToken();

      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    },

    // Clear error message
    clearError: () => {
      set({
        error: null,
      });
    },
  })
);