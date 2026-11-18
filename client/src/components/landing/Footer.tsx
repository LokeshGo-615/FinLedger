import { ArrowUp, ShieldCheck } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Logo } from "../brand/Logo";
import { ScrollReveal } from "../ui/ScrollReveal";
import { FooterLinkGroup } from "./footer/FooterLinkGroup";

const platformLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
  { label: "How it works", href: "#how-it-works" },
];

const resourceLinks = [
  { label: "About FinLedger", href: "#about" },
  {
    label: "Source code",
    href: "https://github.com/LokeshGo-615/FinLedger",
    external: true,
  },
  { label: "Get started", href: "#get-started" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-[#101d14] px-6 pt-16 text-[#f5f8f2] sm:pt-20 lg:px-10">

      {/* Ambient background glow */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-64 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[#9ef494]/10 blur-[150px]"
      />

      <div className="relative mx-auto max-w-7xl">

        {/* Main footer content */}

        <ScrollReveal>

          <div className="grid grid-cols-2 gap-x-8 gap-y-12 pb-14 lg:grid-cols-4 lg:gap-12">

            {/* Brand information */}

            <div className="col-span-2">

              <a
                href="#home"
                aria-label="FinLedger home"
                className="inline-flex"
              >
                <Logo />
              </a>

              <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#a3b6a0] sm:text-base">

                A smarter approach to digital banking.
                Built for simplicity, security and
                transparency.

              </p>

              {/* Social links */}

              <div className="mt-6 flex items-center gap-3">

                <a
                  href="https://github.com/LokeshGo-615/FinLedger"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="FinLedger GitHub repository"
                  className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#b6d6aa] transition-colors duration-300 hover:border-[#9ef494]/40 hover:bg-[#9ef494]/10 hover:text-[#9ef494]"
                >
                  <FaGithub size={18} />
                </a>

              </div>

            </div>

            {/* Platform links */}

            <FooterLinkGroup
              title="Platform"
              links={platformLinks}
            />

            {/* Resource links */}

            <FooterLinkGroup
              title="Resources"
              links={resourceLinks}
            />

          </div>

        </ScrollReveal>

        {/* Simulation disclaimer */}

        <div className="flex flex-col gap-4 border-y border-white/10 py-7 sm:flex-row sm:items-center">

          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#9ef494]/10 text-[#9ef494]">
            <ShieldCheck size={24} strokeWidth={1.6} />
          </div>

          <div>

            <h3 className="text-sm font-medium text-[#d9f4d2]">
              Built for learning. Designed for reliability.
            </h3>

            <p className="mt-1 text-xs leading-relaxed text-[#a3b6a0] sm:text-sm">

              FinLedger is a simulated banking platform
              created for educational purposes. No real
              money or actual banking services are involved.

            </p>

          </div>

        </div>

        {/* Bottom footer */}

        <div className="flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs text-[#a3b6a0]">
            © {currentYear} FinLedger. All rights reserved.
          </p>

          <a
            href="#home"
            className="group inline-flex items-center gap-2 text-sm font-medium text-[#b6d6aa] transition-colors hover:text-[#9ef494]"
          >

            Back to top

            <span className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5">

              <ArrowUp
                size={15}
                className="transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5"
              />

            </span>

          </a>

        </div>

        {/* Oversized brand typography */}

        <div
          aria-hidden="true"
          className="pointer-events-none select-none overflow-hidden text-center"
        >

          <span className="block bg-linear-to-b from-[#9ef494]/20 to-[#9ef494]/0 bg-clip-text font-heading text-[15vw] font-bold leading-none tracking-[-0.075em] text-transparent">

            FinLedger

          </span>

        </div>

      </div>

    </footer>
  );
}