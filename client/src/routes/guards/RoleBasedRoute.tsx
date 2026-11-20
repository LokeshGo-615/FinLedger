import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "../../store/auth.store";
import { FullPageLoader } from "../../components/common/FullPageLoader";

import type { UserRole } from "../../types/auth.types";

interface RoleBasedRouteProps {
  allowedRoles: UserRole[];
}

export function RoleBasedRoute({
  allowedRoles,
}: RoleBasedRouteProps) {
  const user = useAuthStore(
    (state) => state.user
  );

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

  // Check authentication
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check authorization
  if (!allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  // Allow authorized users
  return <Outlet />;
}