import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "../../utils/cn";

type PasswordStrengthProps = {
  password: string;
};

export function PasswordStrength({
  password,
}: PasswordStrengthProps) {
  const requirements = [
    {
      label: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      label: "One uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      label: "One number",
      met: /[0-9]/.test(password),
    },
    {
      label: "One special character",
      met: /[^A-Za-z0-9\s]/.test(password),
    },
  ];

  const score = requirements.filter(
    (requirement) => requirement.met
  ).length;

  const strength =
    score === 0
      ? "Not set"
      : score <= 2
        ? "Weak"
        : score <= 4
          ? "Medium"
          : "Strong";

  const strengthColor =
    score <= 2
      ? "bg-red-500"
      : score <= 4
        ? "bg-amber-500"
        : "bg-emerald-500";

  return (
    <div className="space-y-3 rounded-xl border border-border bg-surface p-4">

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted">
          Password strength
        </span>

        <span className="text-xs font-semibold text-foreground">
          {strength}
        </span>
      </div>

      {/* Strength bars */}
      <div className="flex gap-1.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-300",
              index < score ? strengthColor : "bg-border"
            )}
          />
        ))}
      </div>

      {/* Requirements */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {requirements.map((requirement) => (
          <div
            key={requirement.label}
            className={cn(
              "flex items-center gap-2 text-xs transition-colors",
              requirement.met
                ? "text-primary"
                : "text-muted"
            )}
          >
            {requirement.met ? (
              <CheckCircle2 size={14} />
            ) : (
              <Circle size={14} />
            )}

            {requirement.label}
          </div>
        ))}
      </div>

    </div>
  );
}