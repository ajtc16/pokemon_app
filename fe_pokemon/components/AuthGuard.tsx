"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Protects routes that require authentication
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-grayscale-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-pokemon-red" />
          <p className="font-poppins text-body-2 text-grayscale-medium">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}

/**
 * Redirects authenticated users away from public routes (like login)
 */
export function GuestGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-grayscale-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-pokemon-red" />
          <p className="font-poppins text-body-2 text-grayscale-medium">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
