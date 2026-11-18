import {
  ArrowRight,
  UserRound,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export function TransferVisual() {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="flex min-w-0 flex-1 flex-col items-center rounded-2xl border border-border bg-background/60 p-3 sm:p-5">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
          <UserRound size={20} />
        </div>

        <p className="mt-3 text-xs text-muted">
          Your account
        </p>

        <p className="mt-2 font-semibold text-foreground sm:text-xl">
          ₹84,250
        </p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <span className="rounded-full bg-[#9ef494] px-3 py-1 text-xs font-semibold text-[#17291b]">
          ₹5,000
        </span>

        <ArrowRight
          size={26}
          className="text-primary"
        />

        <CheckCircle2
          size={18}
          className="text-primary"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-center rounded-2xl border border-border bg-background/60 p-3 sm:p-5">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
          <UserRound size={20} />
        </div>

        <p className="mt-3 text-xs text-muted">
          Recipient
        </p>

        <p className="mt-2 font-semibold text-primary sm:text-xl">
          +₹5,000
        </p>
      </div>
    </div>
  );
}


const chartData = [
  30, 48, 38, 60, 47, 71,
  58, 84, 70, 94, 81, 105,
];

export function AnalyticsVisual() {
  return (
    <div>
      <p className="text-xs text-[#45634a]">
        Monthly activity
      </p>

      <h4 className="mt-2 text-3xl font-semibold tracking-tight">
        ₹24,850
      </h4>

      <div
        className="mt-6 flex h-32 items-end gap-2"
        aria-hidden="true"
      >
        {chartData.map((value, index) => (
          <div
            key={index}
            style={{
              height: `${(value / 105) * 100}%`,
            }}
            className={`flex-1 rounded-t-md transition-colors duration-300 hover:bg-[#284d2c] ${
              index === chartData.length - 1
                ? "bg-[#284d2c]"
                : "bg-[#91c588]"
            }`}
          />
        ))}
      </div>

      <div className="mt-3 flex justify-between text-[10px] text-[#45634a]">
        <span>Jan</span>
        <span>Mar</span>
        <span>Jun</span>
        <span>Sep</span>
        <span>Dec</span>
      </div>
    </div>
  );
}

export function SecurityVisual() {
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-44 w-full items-center justify-center">

        <div className="absolute size-40 rounded-full border border-[#9ef494]/10" />

        <div className="absolute size-32 rounded-full border border-[#9ef494]/15" />

        <div className="absolute size-24 rounded-full border border-[#9ef494]/20" />

        <div className="absolute size-24 rounded-full bg-[#9ef494]/15 blur-2xl" />

        <ShieldCheck
          size={76}
          strokeWidth={1.2}
          className="relative text-[#9ef494] transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="flex items-center gap-2 text-xs text-[#9ef494]">
        <CheckCircle2 size={15} />
        Protected authentication
      </div>
    </div>
  );
}


export function LedgerVisual() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#14291b] p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/60">
          Transaction ledger
        </span>

        <span className="flex items-center gap-1 text-xs text-[#9ef494]">
          <CheckCircle2 size={14} />
          Balanced
        </span>
      </div>

      <div className="my-4 h-px bg-white/10" />

      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-white/70">
            Debit entry
          </span>

          <span>₹5,000.00</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-white/70">
            Credit entry
          </span>

          <span>₹5,000.00</span>
        </div>
      </div>

      <div className="my-4 h-px bg-white/10" />

      <div className="flex items-center justify-between">
        <span className="text-xs text-white/60">
          Difference
        </span>

        <span className="text-xl font-semibold text-[#9ef494]">
          ₹0.00
        </span>
      </div>
    </div>
  );
}