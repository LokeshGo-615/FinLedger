import type { ButtonHTMLAttributes } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../../utils/cn";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-90",

  outline:
    "border border-border text-foreground hover:bg-surface",

  ghost:
    "text-foreground hover:bg-surface",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      whileHover={reduceMotion ? undefined : { scale: 1.025 }}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      className="inline-flex"
    >
      <button
        type={type}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200",
          "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    </motion.span>
  );
}