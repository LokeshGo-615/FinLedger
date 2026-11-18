import {
  UserRoundPlus,
  Wallet,
  Plus,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

import {
  motion,
  useReducedMotion,
} from "motion/react";

export function AccountCreationVisual() {
  return (
    <div className="flex h-64 items-center justify-center rounded-2xl bg-[#e8f0e2] p-5">

      <div className="w-full max-w-[230px] rounded-2xl border border-[#cfdeca] bg-white p-4 shadow-lg shadow-green-950/5 transition-transform duration-500 motion-safe:group-hover:-translate-y-2">

        <div className="flex items-center gap-3">

          <div className="flex size-9 items-center justify-center rounded-xl bg-[#d9eacf] text-[#244a2e]">
            <UserRoundPlus size={18} />
          </div>

          <p className="text-sm font-semibold text-[#17291b]">
            Create account
          </p>

        </div>

        <div className="mt-4 space-y-2">

          {["Full name", "Email address", "Password"].map(
            (field) => (
              <div
                key={field}
                className="rounded-lg border border-[#e1e9de] bg-[#f4f7f1] px-3 py-2 text-[10px] text-[#758570]"
              >
                {field}
              </div>
            )
          )}

        </div>

        <div className="mt-3 rounded-lg bg-[#244a2e] py-2 text-center text-xs font-medium text-white">
          Create account
        </div>

      </div>

    </div>
  );
}
export function AddFundsVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex h-64 items-center justify-center rounded-2xl bg-[#d9eacf] p-5">

      <div className="relative w-full max-w-[260px] rounded-2xl bg-[#244a2e] p-5 text-white shadow-xl shadow-green-950/15">

        <div className="flex items-center justify-between">

          <Wallet
            size={24}
            className="text-[#b6d6aa]"
          />

          <motion.div
            animate={{
              y: reduceMotion ? 0 : [0, -7, 0],
            }}
            transition={{
              duration: 3,
              repeat: reduceMotion ? 0 : Infinity,
              ease: "easeInOut",
            }}
            className="flex size-9 items-center justify-center rounded-full bg-[#9ef494] text-[#244a2e]"
          >
            <Plus size={20} />
          </motion.div>

        </div>

        <p className="mt-5 text-xs text-[#b6d6aa]">
          Available balance
        </p>

        <h4 className="mt-2 text-3xl font-semibold tracking-tight">
          ₹10,000.00
        </h4>

        <div className="my-4 h-px bg-white/10" />

        <div className="flex items-center gap-2 text-xs text-[#9ef494]">

          <CheckCircle2 size={15} />

          Virtual funds added

        </div>

      </div>

    </div>
  );
}
export function TransactionVisual() {
  return (
    <div className="flex h-64 items-center justify-center rounded-2xl bg-[#e8f0e2] p-5">

      <div className="flex w-full max-w-[240px] flex-col items-center rounded-2xl border border-[#cfdeca] bg-white p-5 shadow-lg shadow-green-950/5">

        <div className="flex size-[72px] items-center justify-center rounded-full bg-[#d9eacf]">

          <div className="flex size-12 items-center justify-center rounded-full bg-[#244a2e] text-[#9ef494] transition-transform duration-500 motion-safe:group-hover:scale-110">

            <CheckCircle2 size={26} />

          </div>

        </div>

        <p className="mt-4 text-sm font-semibold text-[#17291b]">
          Transfer successful
        </p>

        <h4 className="mt-2 text-2xl font-semibold tracking-tight text-[#17291b]">
          ₹2,500.00
        </h4>

        <div className="mt-3 flex items-center gap-1 text-[10px] text-[#527c4b]">

          <ArrowUpRight size={13} />

          Virtual transaction completed

        </div>

      </div>

    </div>
  );
}