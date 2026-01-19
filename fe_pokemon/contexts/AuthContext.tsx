"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  getToken,
  getExpiresAt,
  getUser,
  setAuthData,
  clearAuthData,
  isAuthenticated as checkIsAuthenticated,
  getTimeUntilExpiration,
} from "@/lib/auth";
import { login as apiLogin } from "@/lib/api";
import type { User, LoginRequest, AuthState } from "@/types";

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    token: null,
    expiresAt: null,
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  /**
   * Check authentication status and restore from storage
   */
  const checkAuth = useCallback((): boolean => {
    const isAuth = checkIsAuthenticated();

    if (isAuth) {
      const token = getToken();
      const expiresAt = getExpiresAt();
      const user = getUser();

      setState({
        token,
        expiresAt,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } else {
      setState({
        token: null,
        expiresAt: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return false;
    }
  }, []);

  /**
   * Initialize auth state from localStorage on mount
   */
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * Set up automatic token expiration check
   */
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const timeUntilExpiration = getTimeUntilExpiration();

    if (timeUntilExpiration <= 0) {
      logout();
      return;
    }

    // Set timeout to logout when token expires
    const timeoutId = setTimeout(() => {
      logout();
      router.push("/login");
    }, timeUntilExpiration);

    return () => clearTimeout(timeoutId);
  }, [state.isAuthenticated, state.expiresAt, router]);

  /**
   * Login user
   */
  const login = async (credentials: LoginRequest): Promise<void> => {
    const response = await apiLogin(credentials);
    console.log("[Auth] Login response:", response);

    // Calculate expires_at from expires_in if needed
    let expiresAt: string;
    if (response.expires_at) {
      expiresAt = response.expires_at;
    } else if (response.expires_in) {
      // Convert seconds to ISO date string
      const expirationDate = new Date(Date.now() + response.expires_in * 1000);
      expiresAt = expirationDate.toISOString();
    } else {
      // Default to 24 hours if no expiration provided
      const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      expiresAt = expirationDate.toISOString();
    }

    // Create user object if not provided (use username from credentials)
    const user: User = response.user || { username: credentials.username };

    console.log("[Auth] Calculated expiresAt:", expiresAt);
    console.log("[Auth] User:", user);

    // Store auth data
    setAuthData(response.token, expiresAt, user);

    // Verify storage
    console.log("[Auth] Token stored:", localStorage.getItem("pokemon_auth_token"));
    console.log("[Auth] Expires stored:", localStorage.getItem("pokemon_auth_expires"));

    // Update state
    setState({
      token: response.token,
      expiresAt: expiresAt,
      user: user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    clearAuthData();
    setState({
      token: null,
      expiresAt: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
