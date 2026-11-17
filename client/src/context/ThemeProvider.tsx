import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Theme } from "../types/theme.ts";
import { ThemeContext } from "./theme-context.ts";

interface ThemeProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = "finledger-theme";

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches
    ? "dark"
    : "light";
}

function getInitialTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (
    saved === "light" ||
    saved === "dark" ||
    saved === "system"
  ) {
    return saved;
  }

  return "system";
}

export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    getInitialTheme
  );

  const [systemTheme, setSystemTheme] =
    useState(getSystemTheme);

  const resolvedTheme =
    theme === "system" ? systemTheme : theme;

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const handleChange = (
      event: MediaQueryListEvent
    ) => {
      setSystemTheme(
        event.matches ? "dark" : "light"
      );
    };

    mediaQuery.addEventListener(
      "change",
      handleChange
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleChange
      );
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle(
      "dark",
      resolvedTheme === "dark"
    );

    root.style.colorScheme = resolvedTheme;

    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, resolvedTheme]);

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}