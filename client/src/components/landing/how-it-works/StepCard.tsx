import type { ReactNode } from "react";

import { ScrollReveal } from "../../ui/ScrollReveal";

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  children: ReactNode;
  delay?: number;
}

export function StepCard({
  step,
  title,
  description,
  children,
  delay = 0,
}: StepCardProps) {
  return (
    <ScrollReveal
      delay={delay}
      className="relative flex h-full flex-col items-center"
    >

      {/* Step number */}

      <div className="relative z-10 flex size-14 items-center justify-center rounded-full border-4 border-background bg-primary text-lg font-semibold text-primary-foreground shadow-lg">

        {String(step).padStart(2, "0")}

      </div>

      {/* Step card */}

      <article className="group mt-8 flex w-full flex-1 flex-col rounded-[28px] border border-border bg-surface p-4 transition-shadow duration-300 hover:shadow-xl sm:p-5">

        {children}

        <div className="px-2 pb-3 pt-6">

          <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-muted">
            {description}
          </p>

        </div>

      </article>

    </ScrollReveal>
  );
}