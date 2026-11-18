import {
  Layers3,
  Monitor,
  Server,
  Database,
} from "lucide-react";

import {
  motion,
  useReducedMotion,
} from "motion/react";

const layers = [
  {
    icon: Monitor,
    title: "User experience",
    description: "React · TypeScript",
    color: "#355b3c",
  },
  {
    icon: Server,
    title: "Application layer",
    description: "Node.js · Express",
    color: "#294832",
  },
  {
    icon: Database,
    title: "Financial data",
    description: "MongoDB · Ledger",
    color: "#203b29",
  },
];

export function ArchitectureVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative isolate overflow-hidden rounded-[32px] border border-[#9ef494]/10 bg-[#132219] px-6 py-10">

      {/* Background grid */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(#9ef494 1px, transparent 1px),
            linear-gradient(90deg, #9ef494 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Ambient lighting */}

      <div className="pointer-events-none absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9ef494]/15 blur-[100px]" />

      {/* Architecture layers */}

      <div className="relative flex min-h-[360px] flex-col items-center justify-center gap-6">

        {layers.map((layer, index) => {
          const Icon = layer.icon;

          return (
            <motion.div
              key={layer.title}
              animate={{
                y: reduceMotion ? 0 : [0, -8, 0],
              }}
              transition={{
                duration: 5,
                delay: index * 0.5,
                repeat: reduceMotion ? 0 : Infinity,
                ease: "easeInOut",
              }}
              className="relative w-full max-w-[320px]"
            >

              <div
                style={{
                  backgroundColor: layer.color,
                  transform: "skewY(-5deg)",
                  boxShadow: "0 10px 0 #14291b",
                }}
                className="rounded-2xl border border-[#9ef494]/20 p-5"
              >

                <div className="flex items-center gap-4 skew-y-[5deg]">

                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#9ef494]/10 text-[#9ef494]">

                    <Icon size={23} strokeWidth={1.6} />

                  </div>

                  <div>

                    <h3 className="text-sm font-semibold text-[#f5f8f2] sm:text-base">
                      {layer.title}
                    </h3>

                    <p className="mt-1 text-xs text-[#a3b6a0]">
                      {layer.description}
                    </p>

                  </div>

                </div>

              </div>

            </motion.div>
          );
        })}

      </div>

      <div className="relative mt-8 flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#9ef494]">

        <Layers3 size={16} />

        Built in layers

      </div>

    </div>
  );
}