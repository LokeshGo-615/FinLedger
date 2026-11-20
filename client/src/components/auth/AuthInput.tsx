import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn";

type AuthInputProps = ComponentProps<"input"> & {
  label: string;
  error?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
};

export function AuthInput({
  label,
  error,
  icon,
  rightElement,
  className,
  id,
  ...props
}: AuthInputProps) {
  return (
    <div className="w-full space-y-2">

      <label
        htmlFor={id}
        className="text-sm font-medium text-foreground"
      >
        {label}
      </label>

      <div className="relative">

        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted">
            {icon}
          </div>
        )}

        <input
          {...props}
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "h-13 w-full rounded-xl border bg-surface px-4 text-sm text-foreground outline-none transition-all duration-200",
            "placeholder:text-muted/70",
            "focus:border-primary focus:ring-4 focus:ring-primary/10",
            "disabled:cursor-not-allowed disabled:opacity-50",
            icon && "pl-12",
            rightElement && "pr-12",
            error ? "border-red-500" : "border-border",
            className
          )}
        />

        {rightElement && (
          <div className="absolute inset-y-0 right-4 flex items-center">
            {rightElement}
          </div>
        )}

      </div>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs text-red-500"
        >
          {error}
        </p>
      )}

    </div>
  );
}