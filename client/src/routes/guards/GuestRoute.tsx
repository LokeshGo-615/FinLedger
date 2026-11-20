import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuthStore } from "../../store/auth.store";
import { FullPageLoader } from "../../components/common/FullPageLoader";

export function GuestRoute() {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const isInitialized = useAuthStore(
    (state) => state.isInitialized
  );

  // Wait for session verification
  if (!isInitialized) {
    return <FullPageLoader />;
  }

  // Logged-in users cannot access auth pages
  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  // Allow guest users
  return <Outlet />;
}