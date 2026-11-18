import {
  Fingerprint,
  ShieldCheck,
  LockKeyhole,
  Activity,
} from "lucide-react";

import { ScrollReveal } from "../ui/ScrollReveal";
import { SecurityVisual } from "./security/SecurityVisual";
import { SecurityItem } from "./security/SecurityItem";

const securityFeatures = [
  {
    icon: Fingerprint,
    title: "Secure authentication",
    description:
      "Short-lived JWT access tokens and refresh token rotation.",
  },
  {
    icon: ShieldCheck,
    title: "Controlled access",
    description:
      "Role-based permissions for protected accounts and resources.",
  },
  {
    icon: LockKeyhole,
    title: "Protected credentials",
    description:
      "Passwords hashed using bcrypt instead of storing plain text.",
  },
  {
    icon: Activity,
    title: "Request protection",
    description:
      "Authentication rate limiting to reduce abusive requests.",
  },
];

export function SecuritySection() {
  return (
    <section
      id="security"
      className="relative overflow-hidden bg-[#101d14] px-6 py-24 text-[#f5f8f2] sm:py-32 lg:px-10"
    >

      {/* Subtle grid texture */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(#ffffff 1px, transparent 1px),
            linear-gradient(90deg, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">

        {/* Security illustration */}

        <ScrollReveal
          distance={25}
          className="order-2 lg:order-1"
        >
          <SecurityVisual />
        </ScrollReveal>

        {/* Security content */}

        <div className="order-1 lg:order-2">

          <ScrollReveal>

            <span className="inline-flex items-center gap-2 rounded-full border border-[#9ef494]/20 bg-[#9ef494]/5 px-4 py-2 text-xs font-medium uppercase tracking-widest text-[#9ef494]">

              <span className="size-2 rounded-full bg-[#9ef494]" />

              Security first

            </span>

            <h2 className="mt-6 font-heading text-4xl font-semibold leading-[1.15] tracking-[-0.045em] sm:text-5xl lg:text-6xl">

              Built around trust.

              <span className="block text-[#9ef494]">
                Secured by design.
              </span>

            </h2>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-[#a3b6a0] sm:text-lg">

              Security isn't an afterthought. It's part of
              our architecture, from authentication to
              access control.

            </p>

          </ScrollReveal>

          {/* Security features */}

          <div className="mt-10 space-y-6">

            {securityFeatures.map((feature, index) => (
              <SecurityItem
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}

          </div>

        </div>

      </div>

    </section>
  );
}