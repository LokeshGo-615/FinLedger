import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { LandingPage } from "../pages/landing/LandingPage";

import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";

import { DashboardPage } from "../pages/dashboard/DashboardPage";

import { NotFoundPage } from "../pages/error/NotFoundPage";
import { UnauthorizedPage } from "../pages/error/UnauthorizedPage";

import { AuthLayout } from "../layouts/AuthLayout";

import { ProtectedRoute } from "./guards/ProtectedRoute";
import { GuestRoute } from "./guards/GuestRoute";

import { ScrollToTop } from "./ScrollToTop";

export function AppRouter() {
  return (
    <BrowserRouter>

      <ScrollToTop />

      <Routes>

        {/* Public routes */}
        <Route
          path="/"
          element={<LandingPage />}
        />

        {/* Guest-only routes */}
        <Route element={<GuestRoute />}>

          <Route element={<AuthLayout />}>

            <Route
              path="/login"
              element={<LoginPage />}
            />

            <Route
              path="/register"
              element={<RegisterPage />}
            />

          </Route>

        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/unauthorized"
            element={<UnauthorizedPage />}
          />

        </Route>

        {/* 404 fallback */}
        <Route
          path="*"
          element={<NotFoundPage />}
        />

      </Routes>

    </BrowserRouter>
  );
}