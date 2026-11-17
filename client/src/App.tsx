import { ThemeSwitcher } from "./components/ui/ThemeSwitcher";
import { useTheme } from "./hooks/useTheme";

function App() {
  const { theme, resolvedTheme } = useTheme();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 bg-background text-foreground transition-colors duration-300">

      <div className="absolute right-6 top-6">
        <ThemeSwitcher />
      </div>

      <span className="rounded-full border border-border px-4 py-2 text-sm">
        A new era of digital finance
      </span>

      <h1 className="font-heading text-6xl font-extrabold tracking-tight">
        finledger.
      </h1>

      <p className="text-muted">
        Your money. Your control.
      </p>

      <button className="cursor-pointer rounded-full bg-primary px-8 py-3 font-medium text-primary-foreground">
        Get Started
      </button>

      <p className="text-xs text-muted">
        Theme: {theme} | Applied: {resolvedTheme}
      </p>

    </main>
  );
}

export default App;