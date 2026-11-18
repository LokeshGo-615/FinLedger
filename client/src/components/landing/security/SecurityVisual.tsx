import {
  Shield,
  LockKeyhole,
  CheckCircle2,
} from "lucide-react";

import {
  motion,
  useReducedMotion,
} from "motion/react";

import { FloatingCard } from "../visuals/FloatingCard";

const rings = [140, 210, 290, 370];

export function SecurityVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="relative isolate flex h-[340px] w-full items-center justify-center sm:h-[480px]"
      aria-hidden="true"
    >

      {/* Ambient green lighting */}

      <div className="absolute size-64 rounded-full bg-[#9ef494]/15 blur-[100px]" />

      {/* Concentric rings */}

      {rings.map((size) => (
        <div
          key={size}
          style={{
            width: size,
            height: size,
          }}
          className="absolute max-h-full max-w-full rounded-full border border-[#9ef494]/15"
        />
      ))}

      {/* Outer rotating orbit */}

      <motion.div
        animate={{
          rotate: reduceMotion ? 0 : 360,
        }}
        transition={{
          duration: 24,
          repeat: reduceMotion ? 0 : Infinity,
          ease: "linear",
        }}
        className="absolute size-[290px] rounded-full border border-dashed border-[#9ef494]/30 sm:size-[370px]"
      >
        <span className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9ef494] shadow-[0_0_15px_#9ef494]" />

        <span className="absolute bottom-0 left-1/2 size-2.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#9ef494]" />
      </motion.div>

      {/* Inner rotating orbit */}

      <motion.div
        animate={{
          rotate: reduceMotion ? 0 : -360,
        }}
        transition={{
          duration: 18,
          repeat: reduceMotion ? 0 : Infinity,
          ease: "linear",
        }}
        className="absolute size-[210px] rounded-full sm:size-[290px]"
      >
        <span className="absolute left-0 top-1/2 size-2 -translate-x-1/2 rounded-full bg-[#9ef494]" />

        <span className="absolute right-0 top-1/2 size-2 translate-x-1/2 rounded-full bg-[#9ef494]/60" />
      </motion.div>

      {/* Central shield */}

      <div className="relative z-10 flex items-center justify-center">

        <Shield
          strokeWidth={0.8}
          className="size-40 fill-[#294a32] text-[#9ef494] drop-shadow-[0_0_25px_#9ef49430] sm:size-56"
        />

        <LockKeyhole
          strokeWidth={1.6}
          className="absolute size-14 text-[#9ef494] sm:size-20"
        />

      </div>

      {/* Authentication card */}

      <FloatingCard
        distance={10}
        className="absolute left-0 top-[12%] z-20 border border-[#9ef494]/20 bg-[#1b3021] p-3 text-white sm:left-[4%] sm:p-4"
      >
        <div className="flex items-center gap-2">

          <CheckCircle2
            size={16}
            className="text-[#9ef494]"
          />

          <span className="text-xs font-medium sm:text-sm">
            JWT verified
          </span>

        </div>

        <p className="mt-2 text-[10px] text-white/50">
          Authentication
        </p>
      </FloatingCard>

      {/* Session card */}

      <FloatingCard
        delay={1}
        distance={8}
        duration={6}
        className="absolute right-0 top-[30%] z-20 border border-[#9ef494]/20 bg-[#1b3021] p-3 text-white sm:p-4"
      >
        <div className="flex items-center gap-2">

          <CheckCircle2
            size={16}
            className="text-[#9ef494]"
          />

          <span className="text-xs font-medium sm:text-sm">
            Session active
          </span>

        </div>

        <p className="mt-2 text-[10px] text-white/50">
          Token rotation
        </p>
      </FloatingCard>

      {/* Authorization card */}

      <FloatingCard
        delay={2}
        distance={12}
        className="absolute bottom-[10%] left-[5%] z-20 border border-[#9ef494]/20 bg-[#1b3021] p-3 text-white sm:p-4"
      >
        <div className="flex items-center gap-2">

          <CheckCircle2
            size={16}
            className="text-[#9ef494]"
          />

          <span className="text-xs font-medium sm:text-sm">
            Access protected
          </span>

        </div>

        <p className="mt-2 text-[10px] text-white/50">
          Role-based access
        </p>
      </FloatingCard>

    </div>
  );
}