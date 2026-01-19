"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-pokemon font-poppins font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pokemon-red focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-pokemon-red text-white hover:bg-pokemon-red-dark",
        secondary:
          "bg-grayscale-light text-grayscale-dark hover:bg-grayscale-medium hover:text-white",
        ghost: "hover:bg-grayscale-light",
        outline:
          "border-2 border-pokemon-red text-pokemon-red hover:bg-pokemon-red hover:text-white",
      },
      size: {
        sm: "h-8 px-3 text-body-3",
        md: "h-10 px-4 text-body-2",
        lg: "h-12 px-6 text-body-1",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
