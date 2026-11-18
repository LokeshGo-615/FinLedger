import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "motion/react";

import { Logo } from "../brand/Logo";
import { ThemeSwitcher } from "../ui/ThemeSwitcher";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
  { label: "How it works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <header className="relative z-50 w-full">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10"
      >
        {/* Brand */}

        <a href="#home" aria-label="FinLedger home">
          <Logo />
        </a>

        {/* Desktop navigation */}

        <div className="hidden items-center gap-6 whitespace-nowrap rounded-full border border-border bg-surface/30 px-7 py-3 backdrop-blur-xl lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop actions */}

        <div className="hidden items-center gap-4 lg:flex">
          <ThemeSwitcher />

          <a
            href="#get-started"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Get started
            <ArrowUpRight size={16} />
          </a>
        </div>

        {/* Mobile menu button */}

        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded-full border border-border p-3 text-foreground lg:hidden"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile navigation */}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-navigation"
            initial={
              reduceMotion ? false : { opacity: 0, y: -10 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -10 }
            }
            transition={{
              duration: reduceMotion ? 0 : 0.2,
            }}
            className="absolute left-4 right-4 top-full rounded-3xl border border-border bg-surface p-6 shadow-xl lg:hidden"
          >
            <div className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="font-medium text-foreground"
                >
                  {link.label}
                </a>
              ))}

              <div className="h-px bg-border" />

              <ThemeSwitcher />

              <a
                href="#get-started"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground"
              >
                Get started
                <ArrowUpRight size={16} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}