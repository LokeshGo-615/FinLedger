import { Outlet, Link } from "react-router-dom";

import { Logo } from "../components/brand/Logo";
import { ThemeSwitcher } from "../components/ui/ThemeSwitcher";
import { AuthVisual } from "../components/auth/AuthVisual";

export function AuthLayout() {
    return (
        <div className="min-h-screen bg-background text-foreground">

            <div className="grid min-h-screen lg:grid-cols-2">

                {/* Left authentication section */}
                <div className="flex min-h-screen flex-col">

                    {/* Header */}
                    <header className="flex items-center justify-between px-6 py-7 sm:px-10">

                        <Link to="/" aria-label="FinLedger home">
                            <Logo />
                        </Link>

                        <ThemeSwitcher />

                    </header>

                    {/* Authentication form */}
                    <main className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">

                        <Outlet />

                    </main>

                    {/* Footer */}
                    <footer className="px-6 py-6 text-center text-xs text-muted">
                        © {new Date().getFullYear()} FinLedger.
                        Simulated banking platform.
                    </footer>

                </div>

                {/* Right visual section */}
                <div className="hidden p-4 pl-0 lg:block">
                    <div className="sticky top-4">
                        <AuthVisual />
                    </div>
                </div>

            </div>

        </div>
    );
}