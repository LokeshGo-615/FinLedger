import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "motion/react";

import {
  UserRound,
  Mail,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { toast } from "sonner";

import { AuthInput } from "../../components/auth/AuthInput";
import { PasswordInput } from "../../components/auth/PasswordInput";
import { PasswordStrength } from "../../components/auth/PasswordStrength";

import {
  registerSchema,
  type RegisterFormData,
} from "../../schemas/auth.schema";

import { useAuthStore } from "../../store/auth.store";
import { getApiErrorMessage } from "../../utils/apiError";

export function RegisterPage() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  // Zustand authentication state
  const registerUser = useAuthStore(
    (state) => state.register
  );

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
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    mode: "onTouched",
  });

  // Watch password for strength indicator
  const password = useWatch({
    control,
    name: "password",
  });

  // Loading and disabled states
  const isBusy = isSubmitting || isLoading;

  const isDisabled = isBusy || !isInitialized;

  // Registration API integration
  const onSubmit = async (data: RegisterFormData) => {
    if (isDisabled) return;

    setErrorMessage(null);

    try {
      await registerUser({
        fullName: data.name,
        email: data.email,
        password: data.password,
      });

      toast.success("Account created successfully", {
        description:
          "Please sign in to your FinLedger account.",
      });

      navigate("/login", {
        replace: true,
      });

    } catch (error) {
      const message = getApiErrorMessage(error);

      setErrorMessage(message);

      toast.error("Registration failed");
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
      <div className="mb-8">

        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
          <Sparkles size={14} />
          Start your journey
        </span>

        <h1 className="mt-6 font-heading text-4xl font-semibold tracking-tight">
          Create your account.
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-muted">
          A smarter way to manage your virtual finances.
          Get started with FinLedger today.
        </p>

      </div>

      {/* Registration form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
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

        {/* Full name */}
        <AuthInput
          id="name"
          label="Full name"
          type="text"
          placeholder="Enter your full name"
          autoComplete="name"
          icon={<UserRound size={18} />}
          error={errors.name?.message}
          disabled={isDisabled}
          {...register("name")}
        />

        {/* Email address */}
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

        {/* Password */}
        <PasswordInput
          id="password"
          label="Password"
          placeholder="Create a strong password"
          autoComplete="new-password"
          error={errors.password?.message}
          disabled={isDisabled}
          {...register("password")}
        />

        {/* Password strength */}
        {password && (
          <PasswordStrength password={password} />
        )}

        {/* Confirm password */}
        <PasswordInput
          id="confirmPassword"
          label="Confirm password"
          placeholder="Confirm your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          disabled={isDisabled}
          {...register("confirmPassword")}
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

              Creating account...
            </>
          ) : (
            <>
              Create account

              <ArrowRight
                size={18}
                className="transition-transform motion-safe:group-hover:translate-x-1"
              />
            </>
          )}
        </button>

      </form>

      {/* Login link */}
      <p className="mt-7 text-center text-sm text-muted">
        Already have an account?{" "}

        <Link
          to="/login"
          className="font-semibold text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>

      {/* Divider */}
      <div className="my-6 h-px bg-border" />

      {/* Platform note */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted">
        <ShieldCheck size={16} className="shrink-0" />
        Virtual finances. No real money involved.
      </div>

    </motion.div>
  );
}