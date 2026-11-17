import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { cn } from "../../utils/cn";
import type { Theme } from "../../types/theme";

const themes = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "system", icon: Monitor, label: "System" },
] as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label="Color theme"
      className="inline-flex items-center gap-1 rounded-full border border-border bg-surface p-1"
    >
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          title={label}
          aria-label={`${label} theme`}
          aria-pressed={theme === value}
          onClick={() => setTheme(value as Theme)}
          className={cn(
            "flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors duration-200",
            theme === value
              ? "bg-primary text-primary-foreground"
              : "text-muted hover:bg-background hover:text-foreground"
          )}
        >
          <Icon size={17} strokeWidth={1.8} />
        </button>
      ))}
    </div>
  );
}