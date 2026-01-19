import { User } from "@/types";

const TOKEN_KEY = "pokemon_auth_token";
const EXPIRES_KEY = "pokemon_auth_expires";
const USER_KEY = "pokemon_auth_user";

/**
 * Check if code is running in browser
 */
const isBrowser = (): boolean => typeof window !== "undefined";

/**
 * Store authentication data in localStorage
 */
export function setAuthData(
  token: string,
  expiresAt: string,
  user: User
): void {
  if (!isBrowser()) return;

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EXPIRES_KEY, expiresAt);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Get stored token
 */
export function getToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Get token expiration date
 */
export function getExpiresAt(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(EXPIRES_KEY);
}

/**
 * Get stored user data
 */
export function getUser(): User | null {
  if (!isBrowser()) return null;

  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
}

/**
 * Clear all authentication data
 */
export function clearAuthData(): void {
  if (!isBrowser()) return;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRES_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Check if the token is expired
 */
export function isTokenExpired(): boolean {
  const expiresAt = getExpiresAt();
  if (!expiresAt) {
    console.log("[Auth] No expiration date found");
    return true;
  }

  try {
    const expirationDate = new Date(expiresAt);
    const now = new Date();

    // Check if date parsed correctly
    if (isNaN(expirationDate.getTime())) {
      console.log("[Auth] Invalid expiration date format:", expiresAt);
      return true;
    }

    const isExpired = now >= new Date(expirationDate.getTime() - 30000);
    console.log("[Auth] Token expiration check:", {
      expiresAt,
      expirationDate: expirationDate.toISOString(),
      now: now.toISOString(),
      isExpired,
    });

    return isExpired;
  } catch (error) {
    console.log("[Auth] Error checking expiration:", error);
    return true;
  }
}

/**
 * Check if user is authenticated (has valid, non-expired token)
 */
export function isAuthenticated(): boolean {
  const token = getToken();
  console.log("[Auth] Checking authentication, token exists:", !!token);

  if (!token) return false;

  const expired = isTokenExpired();
  console.log("[Auth] Is authenticated:", !expired);
  return !expired;
}

/**
 * Get remaining time until token expires (in milliseconds)
 */
export function getTimeUntilExpiration(): number {
  const expiresAt = getExpiresAt();
  if (!expiresAt) return 0;

  try {
    const expirationDate = new Date(expiresAt);
    const now = new Date();
    return Math.max(0, expirationDate.getTime() - now.getTime());
  } catch {
    return 0;
  }
}
