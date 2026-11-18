import {
  ArrowLeftRight,
  ChartNoAxesCombined,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

import { ScrollReveal } from "../ui/ScrollReveal";

import { FeatureCard } from "./features/FeatureCard";

import {
  TransferVisual,
  AnalyticsVisual,
  SecurityVisual,
  LedgerVisual,
} from "./features/FeatureVisuals";

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative bg-background px-6 py-24 sm:py-32 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section heading */}

        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium uppercase tracking-widest text-primary">

            <span className="size-2 rounded-full bg-primary" />

            The FinLedger experience
          </span>

          <h2 className="mt-6 font-heading text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            Everything you need.
            <br className="hidden sm:block" />
            {" "}Nothing you don't.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Powerful technology meets effortless financial
            management in a modern simulated banking
            experience.
          </p>
        </ScrollReveal>

        {/* Bento grid */}

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-5">

          <FeatureCard
            icon={ArrowLeftRight}
            title="Seamless transfers."
            description="Move virtual funds between accounts through a simple and reliable experience."
            className="lg:col-span-3"
            delay={0.1}
          >
            <TransferVisual />
          </FeatureCard>

          <FeatureCard
            icon={ChartNoAxesCombined}
            title="Know your money."
            description="Understand your financial activity with intuitive analytics."
            variant="mint"
            className="lg:col-span-2"
            delay={0.2}
          >
            <AnalyticsVisual />
          </FeatureCard>

          <FeatureCard
            icon={ShieldCheck}
            title="Secure by design."
            description="Built around protected authentication and session management."
            variant="forest"
            className="lg:col-span-2"
            delay={0.1}
          >
            <SecurityVisual />
          </FeatureCard>

          <FeatureCard
            icon={BookOpen}
            title="Every rupee accounted for."
            description="Designed around double-entry accounting principles for consistent transaction records."
            variant="forest"
            className="lg:col-span-3"
            delay={0.2}
          >
            <LedgerVisual />
          </FeatureCard>

        </div>

        <p className="mt-8 text-center text-xs text-muted">
          Product preview. All financial values are simulated.
        </p>

      </div>
    </section>
  );
}