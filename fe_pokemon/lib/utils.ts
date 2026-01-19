import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Create URL with search params
 */
export function createUrlWithParams(
  baseUrl: string,
  params: Record<string, string | number | undefined>
): string {
  const url = new URL(baseUrl, window.location.origin);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.pathname + url.search;
}

/**
 * Parse search params from URL
 */
export function parseSearchParams(searchParams: URLSearchParams): {
  offset: number;
  limit: number;
  search: string;
  sort: string;
} {
  return {
    offset: parseInt(searchParams.get("offset") || "0", 10),
    limit: parseInt(searchParams.get("limit") || "20", 10),
    search: searchParams.get("search") || "",
    sort: searchParams.get("sort") || "number_asc",
  };
}
