import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Ellipsis,
  Bell,
  Eye,
  Wifi,
  BatteryFull,
  UserRound,
} from "lucide-react";

const actions = [
  { label: "Send", icon: ArrowUpRight },
  { label: "Deposit", icon: Plus },
  { label: "Receive", icon: ArrowDownLeft },
  { label: "More", icon: Ellipsis },
];

const transactions = [
  {
    id: 1,
    title: "Account deposit",
    amount: "+₹5,000",
    type: "credit",
  },
  {
    id: 2,
    title: "Wallet transfer",
    amount: "-₹1,250",
    type: "debit",
  },
  {
    id: 3,
    title: "Account deposit",
    amount: "+₹2,500",
    type: "credit",
  },
];

export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[280px] rounded-[42px] border border-white/30 bg-[#8fa58a] p-[5px] shadow-2xl sm:w-[310px]">

      {/* Phone screen */}
      <div className="overflow-hidden rounded-[37px] bg-[#101d14] p-5 text-white">

        {/* Status bar */}
        <div className="flex items-center justify-between text-xs">
          <span>9:41</span>

          <div className="h-5 w-20 rounded-full bg-black" />

          <div className="flex items-center gap-1">
            <Wifi size={14} />
            <BatteryFull size={17} />
          </div>
        </div>

        {/* User information */}
        <div className="mt-7 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#304b35] text-[#9ef494]">
            <UserRound size={20} />
          </div>

          <div className="flex-1">
            <p className="text-[10px] text-white/50">
              Welcome back
            </p>

            <h3 className="text-sm font-semibold">
              Good morning.
            </h3>
          </div>

          <Bell size={18} />
        </div>

        {/* Balance card */}
        <div className="relative mt-6 overflow-hidden rounded-2xl bg-linear-to-br from-[#365a39] to-[#203c28] p-5">

          <div className="flex items-center justify-between">
            <p className="text-xs text-white/65">
              Available balance
            </p>

            <Eye size={15} className="text-white/60" />
          </div>

          <h3 className="mt-3 text-3xl font-semibold tracking-tight">
            ₹84,250.00
          </h3>

          <span className="mt-3 inline-flex rounded-full bg-[#9ef494]/15 px-2 py-1 text-[10px] text-[#9ef494]">
            Demo account
          </span>

          {/* Balance graph */}
          <svg
            viewBox="0 0 240 65"
            className="mt-4 w-full"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M0 55 Q20 35 40 45 T80 30 T120 35 T160 15 T200 20 T240 2 V65 H0 Z"
              fill="#9ef494"
              fillOpacity="0.08"
            />

            <path
              d="M0 55 Q20 35 40 45 T80 30 T120 35 T160 15 T200 20 T240 2"
              stroke="#9ef494"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Quick actions */}
        <div className="mt-5 grid grid-cols-4 gap-2">
          {actions.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#243c2a] text-[#d9f4d2]">
                <Icon size={19} />
              </div>

              <span className="text-[10px] text-white/60">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Recent transactions */}
        <div className="mt-7">
          <h3 className="mb-4 text-sm font-semibold">
            Recent activity
          </h3>

          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center gap-2"
              >
                <div className="flex size-9 items-center justify-center rounded-full bg-[#28432f] text-[#9ef494]">
                  {transaction.type === "credit" ? (
                    <ArrowDownLeft size={17} />
                  ) : (
                    <ArrowUpRight size={17} />
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-xs font-medium">
                    {transaction.title}
                  </p>

                  <p className="text-[10px] text-white/40">
                    Today
                  </p>
                </div>

                <span
                  className={`text-xs font-semibold ${
                    transaction.type === "credit"
                      ? "text-[#9ef494]"
                      : "text-white"
                  }`}
                >
                  {transaction.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Home indicator */}
        <div className="mx-auto mt-8 h-1 w-24 rounded-full bg-white/40" />

      </div>
    </div>
  );
}