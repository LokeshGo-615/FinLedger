import type { LucideIcon } from "lucide-react";

import { ScrollReveal } from "../../ui/ScrollReveal";

interface SecurityItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export function SecurityItem({
  icon: Icon,
  title,
  description,
  delay = 0,
}: SecurityItemProps) {
  return (
    <ScrollReveal delay={delay} distance={15}>

      <div className="group flex items-start gap-4">

        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[#9ef494]/10 bg-[#9ef494]/10 text-[#9ef494] transition-colors duration-300 group-hover:bg-[#9ef494]/20">

          <Icon size={22} strokeWidth={1.7} />

        </div>

        <div>

          <h3 className="font-heading text-base font-semibold text-[#f5f8f2]">
            {title}
          </h3>

          <p className="mt-1 text-sm leading-relaxed text-[#a3b6a0]">
            {description}
          </p>

        </div>

      </div>

    </ScrollReveal>
  );
}