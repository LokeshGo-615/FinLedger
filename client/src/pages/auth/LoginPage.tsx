import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "motion/react";

import {
  Mail,
  ArrowRight,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { toast } from "sonner";

import { AuthInput } from "../../components/auth/AuthInput";
import { PasswordInput } from "../../components/auth/PasswordInput";

import {
  loginSchema,
  type LoginFormData,
} from "../../schemas/auth.schema";

import { useAuthStore } from "../../store/auth.store";
import { getApiErrorMessage } from "../../utils/apiError";

export function LoginPage() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  // Zustand authentication state
  const login = useAuthStore((state) => state.login);

  const isLoading = useAuthStore(
    (state) => state.isLoading
  );

  const isInitialized = useAuthStore(
    (state) => state.isInitialized
  );

  // Backend error state
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },

    mode: "onTouched",
  });

  const isBusy = isSubmitting || isLoading;

  const isDisabled = isBusy || !isInitialized;

  // Login API integration
  const onSubmit = async (data: LoginFormData) => {
    if (isDisabled) return;

    setErrorMessage(null);

    try {
      await login(data);

      toast.success("Login successful", {
        description: "Welcome back to FinLedger.",
      });

      navigate("/dashboard", {
        replace: true,
      });

    } catch (error) {
      const message = getApiErrorMessage(error);

      setErrorMessage(message);

      toast.error("Login failed");
    }
  };

  return (
    <motion.div
      initial={
        reduceMotion ? false : { opacity: 0, y: 20 }
      }
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.5,
      }}
      className="w-full max-w-[420px]"
    >
      {/* Page heading */}
      <div className="mb-9">

        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
          <ShieldCheck size={14} />
          Secure account access
        </span>

        <h1 className="mt-6 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Welcome back.
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          Sign in to continue managing your virtual finances.
        </p>

      </div>

      {/* Login form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
      >

        {/* Backend error message */}
        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500"
          >
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <p>{errorMessage}</p>
          </div>
        )}

        {/* Email input */}
        <AuthInput
          id="email"
          label="Email address"
          type="email"
          placeholder="Enter your email address"
          autoComplete="email"
          icon={<Mail size={18} />}
          error={errors.email?.message}
          disabled={isDisabled}
          {...register("email")}
        />

        {/* Password input */}
        <PasswordInput
          id="password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
          disabled={isDisabled}
          {...register("password")}
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={isDisabled}
          className="group flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {!isInitialized ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              Checking session...
            </>
          ) : isBusy ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              Signing in...
            </>
          ) : (
            <>
              Sign in

              <ArrowRight
                size={18}
                className="transition-transform motion-safe:group-hover:translate-x-1"
              />
            </>
          )}
        </button>

      </form>

      {/* Registration link */}
      <p className="mt-8 text-center text-sm text-muted">
        New to FinLedger?{" "}

        <Link
          to="/register"
          className="font-semibold text-primary hover:underline"
        >
          Create an account
        </Link>

      </p>

      {/* Divider */}
      <div className="my-8 h-px bg-border" />

      {/* Security note */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted">
        <ShieldCheck size={15} />
        Protected by secure authentication.
      </div>

    </motion.div>
  );
}