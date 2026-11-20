import { motion, useReducedMotion } from "motion/react";
import {
  ShieldCheck,
  Wifi,
  ArrowUpRight,
} from "lucide-react";

export function AuthVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <aside className="relative isolate hidden min-h-[700px] flex-col items-center justify-center overflow-hidden rounded-[32px] bg-[#14291b] p-10 text-[#f5f8f2] lg:flex">

      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,#477d44_0%,#203b29_45%,#14291b_80%)]" />

      {/* Vertical texture */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0px, transparent 17px, rgba(255,255,255,0.06) 18px)",
        }}
      />

      {/* Ambient glow */}
      <motion.div
        animate={
          reduceMotion
            ? undefined
            : { opacity: [0.3, 0.6, 0.3] }
        }
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9ef494]/20 blur-[100px]"
      />

      {/* Decorative rings */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
      >
        {[180, 260, 340, 420, 500].map((size) => (
          <div
            key={size}
            className="absolute rounded-full border border-[#9ef494]/10"
            style={{ width: size, height: size }}
          />
        ))}
      </div>

      {/* Floating cards */}
      <div
        aria-hidden="true"
        className="relative h-[370px] w-full max-w-[440px]"
      >

        {/* Virtual bank card */}
        <motion.div
          animate={
            reduceMotion ? undefined : { y: [0, -12, 0] }
          }
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[5%] top-8 w-[76%]"
        >
          <div className="-rotate-12 rounded-[24px] bg-linear-to-br from-[#e5f5d9] to-[#9bc98d] p-6 text-[#203b29] shadow-2xl">

            <div className="flex items-center justify-between">
              <span className="font-heading text-xl font-semibold">
                FinLedger
              </span>

              <Wifi size={22} className="rotate-90" />
            </div>

            <div className="mt-7 h-8 w-11 rounded-md border border-[#355b3c]/20 bg-[#87ae7c]" />

            <p className="mt-7 text-lg font-medium tracking-[0.2em]">
              •••• •••• 2480
            </p>

            <p className="mt-3 text-[10px] tracking-widest">
              VIRTUAL ACCOUNT
            </p>

          </div>
        </motion.div>

        {/* Balance card */}
        <motion.div
          animate={
            reduceMotion ? undefined : { y: [0, 10, 0] }
          }
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-0 top-40 w-[70%]"
        >
          <div className="rotate-6 rounded-[24px] border border-[#9ef494]/20 bg-[#203b29]/95 p-6 shadow-2xl backdrop-blur-xl">

            <p className="text-xs text-[#b6d6aa]">
              Available balance
            </p>

            <h3 className="mt-2 font-heading text-3xl font-semibold">
              ₹84,250.00
            </h3>

            <div className="mt-5 flex items-center gap-1 text-xs text-[#9ef494]">
              <ArrowUpRight size={15} />
              +12.8% this month
            </div>

            {/* Mini chart */}
            <div className="mt-5 flex h-14 items-end gap-1.5">
              {[20, 35, 28, 48, 37, 55, 45, 65, 58, 80].map(
                (height, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t-sm bg-[#9ef494]/50"
                    style={{ height: `${height}%` }}
                  />
                )
              )}
            </div>

          </div>
        </motion.div>

        {/* Security badge */}
        <motion.div
          animate={
            reduceMotion ? undefined : { y: [0, -8, 0] }
          }
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-3 left-0 flex items-center gap-3 rounded-2xl bg-[#d9f4d2] p-4 text-[#203b29] shadow-xl"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#203b29] text-[#9ef494]">
            <ShieldCheck size={22} />
          </div>

          <div>
            <p className="text-sm font-semibold">
              Protected access
            </p>
            <p className="text-xs opacity-70">
              Secure by design
            </p>
          </div>
        </motion.div>

      </div>

      {/* Bottom content */}
      <div className="mt-12 max-w-md text-center">
        <h2 className="font-heading text-3xl font-semibold tracking-tight xl:text-4xl">
          Your finances.
          <br />
          Your control.
        </h2>

        <p className="mt-4 text-sm leading-relaxed text-[#b6d6aa]">
          Experience a smarter, more transparent approach
          to digital banking.
        </p>

        <p className="mt-5 text-xs text-[#b6d6aa]/80">
          Product preview · Simulated financial data
        </p>
      </div>

    </aside>
  );
}