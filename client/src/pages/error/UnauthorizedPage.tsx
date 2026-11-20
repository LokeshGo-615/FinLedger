import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";

import {
  ShieldAlert,
  ArrowLeft,
  House,
} from "lucide-react";

export function UnauthorizedPage() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 text-foreground">

      {/* Background glow */}
      <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />

      <motion.div
        initial={
          reduceMotion
            ? false
            : { opacity: 0, y: 20 }
        }
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.5,
        }}
        className="relative w-full max-w-lg text-center"
      >

        {/* Security icon */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/10">
          <ShieldAlert
            size={44}
            className="text-red-500"
          />
        </div>

        {/* Error code */}
        <h1 className="mt-8 font-heading text-8xl font-semibold tracking-tighter text-primary sm:text-9xl">
          403
        </h1>

        <h2 className="mt-4 font-heading text-3xl font-semibold">
          Access restricted.
        </h2>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted sm:text-base">
          You don't have the required permissions
          to access this page. Please contact your
          administrator if you believe this is an error.
        </p>

        {/* Navigation buttons */}
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <ArrowLeft size={17} />

            Back to dashboard
          </Link>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-6 py-3 text-sm font-medium transition-colors hover:border-primary"
          >
            <House size={17} />

            Go home
          </Link>

        </div>

        <p className="mt-12 text-xs text-muted">
          FinLedger · Access control system
        </p>

      </motion.div>
    </div>
  );
}