"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { GuestGuard } from "@/components/AuthGuard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { ApiRequestError } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log("[Login] Form submitted with:", data);
    setServerError(null);

    try {
      console.log("[Login] Calling login API...");
      await login(data);
      console.log("[Login] Login successful!");

      // Verify token was stored
      const storedToken = localStorage.getItem("pokemon_auth_token");
      console.log("[Login] Verified token in storage:", !!storedToken);

      if (storedToken) {
        console.log("[Login] Redirecting to home...");
        router.push("/");
        router.refresh();
      } else {
        setServerError("Failed to save authentication. Please try again.");
      }
    } catch (error) {
      console.log("[Login] Error:", error);
      if (error instanceof ApiRequestError) {
        setServerError(error.message);
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Debug form state
  console.log("[Login] Form state:", { isValid, isSubmitting, errors });

  return (
    <GuestGuard>
      <div className="flex min-h-screen flex-col items-center justify-center bg-pokemon-red px-4">
        {/* Logo */}
        <div className="mb-8 text-center">
          <svg
            className="mx-auto h-16 w-16 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
            <line
              x1="2"
              y1="12"
              x2="9"
              y2="12"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="15"
              y1="12"
              x2="22"
              y2="12"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <h1 className="mt-4 font-poppins text-headline text-white">Pokédex</h1>
          <p className="mt-1 font-poppins text-body-2 text-white/80">
            Sign in to continue
          </p>
        </div>

        {/* Login Form Card */}
        <div className="w-full max-w-sm rounded-pokemon bg-white p-6 shadow-drop-shadow-6dp">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Server Error */}
            {serverError && (
              <div
                className="mb-4 rounded-pokemon bg-pokemon-red/10 p-3 text-center"
                role="alert"
              >
                <p className="font-poppins text-body-3 text-pokemon-red">
                  {serverError}
                </p>
              </div>
            )}

            {/* Username Field */}
            <div className="mb-4">
              <label
                htmlFor="username"
                className="mb-1 block font-poppins text-body-2 text-grayscale-dark"
              >
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                autoComplete="username"
                leftIcon={<User className="h-4 w-4" />}
                error={errors.username?.message}
                aria-describedby={errors.username ? "username-error" : undefined}
                {...register("username")}
              />
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="mb-1 block font-poppins text-body-2 text-grayscale-dark"
              >
                Password
              </label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
                error={errors.password?.message}
                aria-describedby={errors.password ? "password-error" : undefined}
                {...register("password")}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
            >
              Sign In
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 font-poppins text-caption text-white/60">
          Gotta catch &apos;em all!
        </p>
      </div>
    </GuestGuard>
  );
}
