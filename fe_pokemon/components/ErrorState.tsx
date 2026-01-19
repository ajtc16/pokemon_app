"use client";

import { AlertCircle, RefreshCw, ServerOff, Search } from "lucide-react";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  type?: "error" | "not-found" | "service-unavailable" | "empty";
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

const errorConfig = {
  error: {
    icon: AlertCircle,
    defaultTitle: "Something went wrong",
    defaultMessage: "An unexpected error occurred. Please try again.",
    iconColor: "text-pokemon-red",
  },
  "not-found": {
    icon: Search,
    defaultTitle: "Not found",
    defaultMessage: "The Pokemon you're looking for doesn't exist.",
    iconColor: "text-grayscale-medium",
  },
  "service-unavailable": {
    icon: ServerOff,
    defaultTitle: "Service unavailable",
    defaultMessage: "Our servers are currently down. Please try again later.",
    iconColor: "text-grayscale-medium",
  },
  empty: {
    icon: Search,
    defaultTitle: "No results",
    defaultMessage: "No Pokemon found matching your search.",
    iconColor: "text-grayscale-medium",
  },
};

export function ErrorState({
  type = "error",
  title,
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  const config = errorConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center",
        className
      )}
      role="alert"
    >
      <Icon className={cn("h-16 w-16 mb-4", config.iconColor)} />
      <h2 className="font-poppins text-subtitle-1 text-grayscale-dark mb-2">
        {title || config.defaultTitle}
      </h2>
      <p className="font-poppins text-body-2 text-grayscale-medium mb-4 max-w-xs">
        {message || config.defaultMessage}
      </p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      )}
    </div>
  );
}
