"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-grayscale-medium">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-pokemon border bg-grayscale-white px-3 py-2 font-poppins text-body-1 text-grayscale-dark placeholder:text-grayscale-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pokemon-red focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error
              ? "border-pokemon-red ring-1 ring-pokemon-red"
              : "border-grayscale-light",
            className
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-grayscale-medium">
            {rightIcon}
          </div>
        )}
        {error && (
          <p className="mt-1 text-body-3 text-pokemon-red" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
