import {
  motion,
  useReducedMotion,
} from "motion/react";

const rings = [320, 420, 520, 620, 720, 820];

export function CTABackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Base gradient */}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,#477d44_0%,#203b29_40%,#14291b_80%)]" />

      {/* Vertical texture */}

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "18px 100%",
        }}
      />

      {/* Ambient glow */}

      <motion.div
        animate={{
          opacity: reduceMotion ? 0.4 : [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: reduceMotion ? 0 : Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-40 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[#9ef494]/20 blur-[120px]"
      />

      {/* Animated concentric rings */}

      <div className="absolute -bottom-32 left-1/2">

        {rings.map((size, index) => (
          <motion.div
            key={size}
            animate={{
              scale: reduceMotion ? 1 : [1, 1.05, 1],
            }}
            transition={{
              duration: 6,
              delay: index * 0.3,
              repeat: reduceMotion ? 0 : Infinity,
              ease: "easeInOut",
            }}
            style={{
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
            }}
            className="absolute rounded-full border border-[#9ef494]/10"
          />
        ))}

      </div>

      {/* Top vignette */}

      <div className="absolute inset-0 bg-linear-to-b from-[#14291b]/40 via-transparent to-transparent" />

    </div>
  );
}