import { motion, useReducedMotion } from "motion/react";
import { ShieldCheck } from "lucide-react";

interface FullPageLoaderProps {
  message?: string;
}

export function FullPageLoader({
  message = "Verifying your session...",
}: FullPageLoaderProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      role="status"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background text-foreground"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute h-80 w-80 rounded-full bg-primary/10 blur-[100px]" />

      <div className="relative flex flex-col items-center">

        {/* Animated loader */}
        <div className="relative flex h-28 w-28 items-center justify-center">

          <motion.div
            animate={{
              rotate: reduceMotion ? 0 : 360,
            }}
            transition={{
              duration: 1.5,
              repeat: reduceMotion ? 0 : Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 rounded-full border-2 border-primary/10 border-t-primary"
          />

          <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-primary/20 bg-primary/10">
            <ShieldCheck
              size={36}
              className="text-primary"
            />
          </div>

        </div>

        {/* Brand */}
        <h2 className="mt-8 font-heading text-3xl font-semibold tracking-tight">
          FinLedger
          <span className="text-primary">.</span>
        </h2>

        <p className="mt-3 text-sm text-muted">
          {message}
        </p>

        <p className="mt-12 text-xs text-muted/70">
          Smart. Secure. Simplified.
        </p>

      </div>
    </div>
  );
}