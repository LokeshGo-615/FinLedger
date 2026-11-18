import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import { Button } from "../ui/Button";

import {
  staggerContainer,
  fadeUp,
} from "../../lib/animations";

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      variants={reduceMotion ? undefined : staggerContainer}
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
      className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 pb-0 pt-10 text-center sm:pt-12 lg:pt-16"
    >
      {/* Announcement badge */}

      <motion.div
        variants={reduceMotion ? undefined : fadeUp}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/30 px-4 py-2 text-sm backdrop-blur-md"
      >
        <span className="relative flex size-2">

          <span className="absolute inline-flex size-full rounded-full bg-primary opacity-40 motion-safe:animate-ping" />

          <span className="relative inline-flex size-2 rounded-full bg-primary" />

        </span>

        A new era of digital finance
      </motion.div>

      {/* Main heading */}

      <motion.h1
        variants={reduceMotion ? undefined : fadeUp}
       className="mt-6 max-w-5xl font-heading text-4xl font-semibold leading-[1.12] tracking-[-0.045em] sm:text-5xl lg:text-6xl"
      >
        Your money. Your control.

        <br className="hidden sm:block" />

        {" "}Banking, reimagined.
      </motion.h1>

      {/* Description */}

      <motion.p
        variants={reduceMotion ? undefined : fadeUp}
        className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
      >
        A smarter way to manage, move and understand
        your money through a modern simulated banking
        experience.
      </motion.p>

      {/* CTA button */}

      <motion.div
        variants={reduceMotion ? undefined : fadeUp}
        id="get-started"
        className="mt-7"
      >
        <Button size="lg">
          Explore FinLedger

          <ArrowUpRight size={20} />
        </Button>
      </motion.div>

    </motion.section>
  );
}