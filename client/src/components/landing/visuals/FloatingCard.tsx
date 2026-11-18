import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "../../../utils/cn";

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
}

export function FloatingCard({
  children,
  className,
  delay = 0,
  duration = 5,
  distance = 10,
}: FloatingCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={
        reduceMotion
          ? { y: 0 }
          : { y: [0, -distance, 0] }
      }
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }
      }
      className={cn(
        "rounded-2xl p-5 shadow-xl",
        className
      )}
    >
      {children}
    </motion.div>
  );
}