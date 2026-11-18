import { cn } from "../../utils/cn";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function Logo({
  className,
  iconOnly = false,
}: LogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5",
        className
      )}
      aria-label="FinLedger"
    >
      <svg
        width="34"
        height="34"
        viewBox="0 0 40 40"
        fill="none"
        className="shrink-0 text-primary"
        aria-hidden="true"
      >
        <rect
          x="1" y="1"
          width="17" height="17"
          rx="4"
          fill="currentColor"
        />

        <rect
          x="22" y="1"
          width="17" height="17"
          rx="4"
          fill="currentColor"
          opacity="0.65"
        />

        <rect
          x="1" y="22"
          width="17" height="17"
          rx="4"
          fill="currentColor"
          opacity="0.65"
        />

        <rect
          x="22" y="22"
          width="17" height="17"
          rx="4"
          fill="currentColor"
        />
      </svg>

      {!iconOnly && (
        <span className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
          finledger.
        </span>
      )}
    </span>
  );
}