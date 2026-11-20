import { useState } from "react";
import type { ComponentProps } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { AuthInput } from "./AuthInput";

type PasswordInputProps = Omit<
  ComponentProps<typeof AuthInput>,
  "type" | "icon" | "rightElement"
>;

export function PasswordInput(props: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthInput
      {...props}
      type={showPassword ? "text" : "password"}
      icon={<LockKeyhole size={18} />}
      rightElement={
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={
            showPassword ? "Hide password" : "Show password"
          }
          className="text-muted transition-colors hover:text-foreground"
        >
          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      }
    />
  );
}