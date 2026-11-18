import { ScrollReveal } from "../ui/ScrollReveal";

import { ArchitectureVisual } from "./about/ArchitectureVisual";

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-background px-6 py-24 sm:py-32 lg:px-10"
    >

      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">

        {/* About content */}

        <ScrollReveal>

          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium uppercase tracking-widest text-primary">

            <span className="size-2 rounded-full bg-primary" />

            About FinLedger

          </span>

          <h2 className="mt-6 font-heading text-4xl font-semibold leading-[1.15] tracking-[-0.045em] text-foreground sm:text-5xl lg:text-6xl">

            Finance made simpler.

            <span className="mt-2 block text-primary">
              Engineering made stronger.
            </span>

          </h2>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">

            FinLedger is a modern simulated banking platform
            designed to make financial interactions simple,
            transparent and intuitive.

          </p>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">

            Behind every interaction is a modular architecture
            designed around security, financial consistency
            and reliable transaction processing.

          </p>

          {/* Project principles */}

          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-8">

            <div>

              <h3 className="font-heading text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
                100%
              </h3>

              <p className="mt-2 text-sm text-muted">
                Simulated finance
              </p>

            </div>

            <div>

              <h3 className="font-heading text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
                2-way
              </h3>

              <p className="mt-2 text-sm text-muted">
                Planned ledger accounting
              </p>

            </div>

          </div>

        </ScrollReveal>

        {/* Architecture illustration */}

        <ScrollReveal delay={0.2} distance={25}>

          <ArchitectureVisual />

        </ScrollReveal>

      </div>

    </section>
  );
}