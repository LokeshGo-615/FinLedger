import {
  motion,
  useReducedMotion,
} from "motion/react";

import { ScrollReveal } from "../ui/ScrollReveal";

import { StepCard } from "./how-it-works/StepCard";

import {
  AccountCreationVisual,
  AddFundsVisual,
  TransactionVisual,
} from "./how-it-works/StepVisuals";

const steps = [
  {
    step: 1,
    title: "Create your account.",
    description:
      "Register in a few simple steps and get access to your personal digital banking dashboard.",
    visual: AccountCreationVisual,
  },
  {
    step: 2,
    title: "Add virtual funds.",
    description:
      "Fund your digital account with simulated money and explore your financial possibilities.",
    visual: AddFundsVisual,
  },
  {
    step: 3,
    title: "Start transacting.",
    description:
      "Transfer virtual funds, track your activity and manage your accounts in one place.",
    visual: TransactionVisual,
  },
];

export function HowItWorksSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="how-it-works"
      className="relative bg-background px-6 py-24 sm:py-32 lg:px-10"
    >

      <div className="mx-auto max-w-7xl">

        {/* Section heading */}

        <ScrollReveal className="mx-auto max-w-3xl text-center">

          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium uppercase tracking-widest text-primary">

            <span className="size-2 rounded-full bg-primary" />

            How it works

          </span>

          <h2 className="mt-6 font-heading text-4xl font-semibold leading-tight tracking-[-0.045em] text-foreground sm:text-5xl lg:text-6xl">

            Three steps.

            <span className="block">
              Endless possibilities.
            </span>

          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Getting started with FinLedger is simpler
            than you think. Experience digital banking
            without unnecessary complications.
          </p>

        </ScrollReveal>

        {/* Steps container */}

        <div className="relative mt-16">

          {/* Animated connecting line */}

          <motion.div
            aria-hidden="true"
            initial={
              reduceMotion ? false : { scaleX: 0 }
            }
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: reduceMotion ? 0 : 1.5,
              ease: "easeInOut",
            }}
            className="absolute left-[16.67%] right-[16.67%] top-7 hidden origin-left border-t-2 border-dashed border-primary/30 lg:block"
          />

          {/* Step cards */}

          <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6">

            {steps.map((item, index) => {
              const Visual = item.visual;

              return (
                <StepCard
                  key={item.step}
                  step={item.step}
                  title={item.title}
                  description={item.description}
                  delay={index * 0.15}
                >
                  <Visual />
                </StepCard>
              );
            })}

          </div>

        </div>

      </div>

    </section>
  );
}