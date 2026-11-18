import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "../../../utils/cn";
import { ScrollReveal } from "../../ui/ScrollReveal";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
  variant?: "default" | "mint" | "forest";
  delay?: number;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  children,
  className,
  variant = "default",
  delay = 0,
}: FeatureCardProps) {
  return (
    <ScrollReveal
      delay={delay}
      className={className}
    >
      <article
        className={cn(
          "group relative flex h-full min-h-[340px] flex-col overflow-hidden rounded-[28px] border p-7 transition-shadow duration-300 hover:shadow-xl sm:p-9",

          variant === "default" &&
            "border-border bg-surface text-foreground",

          variant === "mint" &&
            "border-transparent bg-[#d9f4d2] text-[#17291b]",

          variant === "forest" &&
            "border-white/10 bg-[#203b29] text-[#f5f8f2]"
        )}
      >
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-2xl",

            variant === "default" &&
              "bg-primary/10 text-primary",

            variant === "mint" &&
              "bg-[#284d2c]/10 text-[#284d2c]",

            variant === "forest" &&
              "bg-white/10 text-[#9ef494]"
          )}
        >
          <Icon size={24} />
        </div>

        <h3 className="mt-5 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h3>

        <p
          className={cn(
            "mt-3 max-w-md text-sm leading-relaxed",

            variant === "default" && "text-muted",

            variant === "mint" && "text-[#45634a]",

            variant === "forest" && "text-white/60"
          )}
        >
          {description}
        </p>

        <div className="mt-auto pt-8">
          {children}
        </div>
      </article>
    </ScrollReveal>
  );
}