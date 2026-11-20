import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">

      <div className="text-center">

        <span className="font-heading text-[120px] font-bold leading-none tracking-tighter text-primary sm:text-[180px]">
          404
        </span>

        <h1 className="mt-4 font-heading text-3xl font-semibold">
          Page not found.
        </h1>

        <p className="mt-4 text-muted">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

      </div>nex

    </main>
  );
}