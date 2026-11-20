import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  ShieldCheck,
  LogOut,
  UserRound,
  Mail,
  Fingerprint,
  Loader2,
} from "lucide-react";

import { useAuthStore } from "../../store/auth.store";
import { getApiErrorMessage } from "../../utils/apiError";

export function DashboardPage() {
  const navigate = useNavigate();

  const user = useAuthStore(
    (state) => state.user
  );

  const logout = useAuthStore(
    (state) => state.logout
  );

  const isLoading = useAuthStore(
    (state) => state.isLoading
  );

  // Logout handler
  const handleLogout = async () => {
    if (isLoading) return;

    try {
      await logout();

      toast.success("Logged out successfully");

      navigate("/login", {
        replace: true,
      });

    } catch (error) {
      toast.error(
        getApiErrorMessage(error)
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">

      <div className="w-full max-w-xl rounded-3xl border border-border bg-surface p-8 shadow-sm sm:p-10">

        {/* Authentication status */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <ShieldCheck
            size={32}
            className="text-primary"
          />
        </div>

        {/* Welcome message */}
        <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight">
          Welcome, {user?.fullName}.
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-muted">
          Your authentication session is active.
          Welcome to the FinLedger dashboard.
        </p>

        {/* User information */}
        <div className="mt-8 space-y-5 rounded-2xl border border-border p-5">

          <div className="flex items-center gap-4">
            <UserRound
              size={20}
              className="text-primary"
            />

            <div>
              <p className="text-xs text-muted">
                Full name
              </p>

              <p className="mt-1 text-sm font-medium">
                {user?.fullName}
              </p>
            </div>
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-center gap-4">
            <Mail
              size={20}
              className="text-primary"
            />

            <div>
              <p className="text-xs text-muted">
                Email address
              </p>

              <p className="mt-1 text-sm font-medium">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-center gap-4">
            <Fingerprint
              size={20}
              className="text-primary"
            />

            <div>
              <p className="text-xs text-muted">
                Account role
              </p>

              <span className="mt-1 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {user?.role}
              </span>
            </div>
          </div>

        </div>

        {/* Logout button */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoading}
          className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              Signing out...
            </>
          ) : (
            <>
              <LogOut size={18} />

              Sign out
            </>
          )}
        </button>

        <p className="mt-6 text-center text-xs text-muted">
          FinLedger · Authentication testing dashboard
        </p>

      </div>
    </div>
  );
}