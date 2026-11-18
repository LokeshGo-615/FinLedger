import {
  motion,
  useReducedMotion,
} from "motion/react";

import {
  ShieldCheck,
  Sparkles,
  Check,
  TrendingUp,
} from "lucide-react";

import { PhoneMockup } from "./visuals/PhoneMockup";
import { FloatingCard } from "./visuals/FloatingCard";

export function HeroVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        reduceMotion
          ? false
          : { opacity: 0, y: 40 }
      }
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 1,
        delay: reduceMotion ? 0 : 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative mx-auto mt-12 h-[430px] w-full max-w-5xl sm:h-[480px]"
      aria-hidden="true"
    >

      {/* Background lighting */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-80 w-[85%] -translate-x-1/2 rounded-full bg-[#83e35e]/15 blur-[100px]" />

      {/* Central mobile mockup */}
      <div className="absolute left-1/2 top-6 z-20 -translate-x-1/2">
        <PhoneMockup />
      </div>

      {/* Top left card */}
      <FloatingCard
        distance={12}
        duration={5}
        className="absolute left-[3%] top-0 z-30 hidden w-56 bg-[#d9f4d2] text-[#17291b] lg:block"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">
            Transaction integrity
          </span>

          <Sparkles
            size={24}
            className="text-[#72b766]"
          />
        </div>

        <h3 className="mt-4 text-3xl font-bold tracking-tight">
          Balanced.
        </h3>

        <p className="mt-2 text-xs text-[#45634a]">
          Double-entry ledger
        </p>

        <svg
          viewBox="0 0 180 40"
          fill="none"
          className="mt-4 w-full"
        >
          <path
            d="M0 35 L25 24 L48 29 L75 12 L100 20 L130 8 L150 13 L180 1"
            stroke="#72b766"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </FloatingCard>

      {/* Bottom left card */}
      <FloatingCard
        delay={1}
        duration={6}
        distance={9}
        className="absolute left-[9%] top-60 z-30 hidden w-48 border border-border bg-surface/80 text-foreground backdrop-blur-xl lg:block"
      >
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted">
            Monthly cash flow
          </p>

          <TrendingUp
            size={17}
            className="text-primary"
          />
        </div>

        <h3 className="mt-3 text-2xl font-semibold">
          +₹12,450
        </h3>

        <p className="mt-2 text-[10px] text-muted">
          Simulated activity
        </p>
      </FloatingCard>

      {/* Top right card */}
      <FloatingCard
        delay={0.5}
        distance={11}
        duration={5.5}
        className="absolute right-[2%] top-14 z-30 hidden w-60 border border-border bg-surface/80 text-foreground backdrop-blur-xl lg:block"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">
            Account protection
          </span>

          <ShieldCheck
            size={24}
            className="text-primary"
          />
        </div>

        <h3 className="mt-4 text-2xl font-semibold tracking-tight">
          Secure sessions
        </h3>

        <p className="mt-2 text-xs text-muted">
          Protected authentication
        </p>

        <div className="mt-5 flex items-center gap-2">
          <div className="size-2 rounded-full bg-primary" />

          <span className="text-xs text-primary">
            Session protected
          </span>
        </div>
      </FloatingCard>

      {/* Bottom right notification */}
      <FloatingCard
        delay={1.2}
        distance={8}
        duration={4.5}
        className="absolute right-[5%] top-72 z-30 hidden rounded-full bg-[#d9f4d2] px-4 py-3 text-[#17291b] lg:block"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold">
            Transfer successful
          </span>

          <div className="flex size-7 items-center justify-center rounded-full bg-[#17291b] text-[#9ef494]">
            <Check size={16} />
          </div>
        </div>
      </FloatingCard>

    </motion.div>
  );
}