import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import { ScrollReveal } from "../ui/ScrollReveal";
import { CTABackground } from "./cta/CTABackground";

interface CTASectionProps {
  onRegister?: () => void;
  onLogin?: () => void;
}

const benefits = [
  "Free to explore",
  "Virtual money",
  "No real deposits",
];

export function CTASection({
  onRegister,
  onLogin,
}: CTASectionProps) {
  return (
    <section
      id="get-started"
      className="bg-background px-6 py-16 sm:py-24 lg:px-10"
    >
      <ScrollReveal className="mx-auto max-w-7xl">

        <div className="relative isolate overflow-hidden rounded-[32px] border border-[#9ef494]/10 bg-[#14291b] px-6 py-20 sm:rounded-[40px] sm:px-12 sm:py-28 lg:py-32">

          <CTABackground />

          {/* Main content */}

          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">

            {/* Section badge */}

            <ScrollReveal distance={15}>

              <span className="inline-flex items-center gap-2 rounded-full border border-[#9ef494]/20 bg-[#9ef494]/5 px-4 py-2 text-xs font-medium uppercase tracking-widest text-[#d9f4d2]">

                <Sparkles size={14} />

                Your next move

              </span>

            </ScrollReveal>

            {/* Main heading */}

            <ScrollReveal delay={0.1}>

              <h2 className="mt-7 font-heading text-4xl font-semibold leading-[1.12] tracking-[-0.045em] text-[#f5f8f2] sm:text-5xl lg:text-7xl">

                A smarter way

                <span className="block bg-linear-to-r from-[#d9f4d2] to-[#9ef494] bg-clip-text text-transparent">
                  to experience banking.
                </span>

              </h2>

            </ScrollReveal>

            {/* Description */}

            <ScrollReveal delay={0.2}>

              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#bcd0b7] sm:text-lg">

                Take control of your virtual finances with a
                platform built for simplicity, security
                and transparency.

              </p>

            </ScrollReveal>

            {/* CTA buttons */}

            <ScrollReveal delay={0.3}>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

                <button
                  type="button"
                  onClick={onRegister}
                  disabled={!onRegister}
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#9ef494] px-7 py-4 text-sm font-semibold text-[#17291b] transition-colors duration-300 hover:bg-[#c0f8b8] disabled:cursor-not-allowed sm:w-auto"
                >

                  Create your account

                  <ArrowUpRight
                    size={18}
                    className="transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                  />

                </button>

                <button
                  type="button"
                  onClick={onLogin}
                  disabled={!onLogin}
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white/10 disabled:cursor-not-allowed sm:w-auto"
                >

                  Sign in

                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 motion-safe:group-hover:translate-x-1"
                  />

                </button>

              </div>

              {!onRegister && !onLogin && (
                <p className="mt-3 text-xs text-[#bcd0b7]">
                  Account access coming soon.
                </p>
              )}

            </ScrollReveal>

            {/* Supporting benefits */}

            <ScrollReveal delay={0.4}>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">

                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-2 text-xs text-[#bcd0b7]"
                  >

                    <CheckCircle2
                      size={14}
                      className="text-[#9ef494]"
                    />

                    {benefit}

                  </div>
                ))}

              </div>

            </ScrollReveal>

          </div>

        </div>

      </ScrollReveal>
    </section>
  );
}