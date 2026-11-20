import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useAuthStore } from "../../store/auth.store";
import { FullPageLoader } from "../../components/common/FullPageLoader";

export function ProtectedRoute() {
  const location = useLocation();

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

  // Redirect unauthenticated users
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Allow access
  return <Outlet />;
}