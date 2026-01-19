import { getToken, clearAuthData, isTokenExpired } from "./auth";
import type {
  LoginRequest,
  LoginResponse,
  PokemonListResponse,
  PokemonDetail,
  ApiError,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

/**
 * Custom error class for API errors
 */
export class ApiRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

/**
 * Build headers for API requests
 */
function buildHeaders(includeAuth: boolean = true): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
}

/**
 * Handle API response and errors
 */
async function handleResponse<T>(response: Response): Promise<T> {
  // Handle 401 - Unauthorized
  if (response.status === 401) {
    clearAuthData();
    // Redirect to login if in browser
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new ApiRequestError("Unauthorized - Please log in again", 401);
  }

  // Handle 404 - Not Found
  if (response.status === 404) {
    throw new ApiRequestError("Resource not found", 404);
  }

  // Handle 5xx errors
  if (response.status >= 500) {
    throw new ApiRequestError(
      "Service unavailable. Please try again later.",
      response.status
    );
  }

  // Handle other error responses
  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // Response may not be JSON
    }
    throw new ApiRequestError(errorMessage, response.status);
  }

  // Parse successful response
  try {
    return await response.json();
  } catch {
    throw new ApiRequestError("Failed to parse response", 500);
  }
}

/**
 * Make an API request with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  includeAuth: boolean = true
): Promise<T> {
  // Check token expiration before making authenticated requests
  if (includeAuth && isTokenExpired()) {
    clearAuthData();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new ApiRequestError("Session expired - Please log in again", 401);
  }

  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...buildHeaders(includeAuth),
      ...options.headers,
    },
  });

  return handleResponse<T>(response);
}

// ============================================
// Authentication API
// ============================================

/**
 * Login user
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>(
    "/login",
    {
      method: "POST",
      body: JSON.stringify(credentials),
    },
    false // Don't include auth for login
  );
}

// ============================================
// Pokemon API
// ============================================

/**
 * Get paginated list of Pokemon
 */
export async function getPokemonList(
  offset: number = 0,
  limit: number = 20
): Promise<PokemonListResponse> {
  return apiRequest<PokemonListResponse>(
    `/pokemons?offset=${offset}&limit=${limit}`
  );
}

/**
 * Get Pokemon details by ID or name
 */
export async function getPokemonDetail(
  idOrName: string | number
): Promise<PokemonDetail> {
  return apiRequest<PokemonDetail>(`/pokemons/${idOrName}`);
}

// ============================================
// Utility Functions
// ============================================

/**
 * Extract Pokemon ID from PokeAPI URL
 * Example: "https://pokeapi.co/api/v2/pokemon/1/" -> 1
 */
export function extractPokemonId(url: string): number {
  const matches = url.match(/\/pokemon\/(\d+)\/?$/);
  if (matches && matches[1]) {
    return parseInt(matches[1], 10);
  }
  // Try alternate pattern for /pokemons/ endpoint
  const altMatches = url.match(/\/pokemons?\/(\d+)\/?$/);
  if (altMatches && altMatches[1]) {
    return parseInt(altMatches[1], 10);
  }
  return 0;
}

/**
 * Get official artwork URL for a Pokemon
 */
export function getPokemonImageUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/**
 * Get sprite URL for a Pokemon
 */
export function getPokemonSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

/**
 * Format Pokemon name (capitalize first letter)
 */
export function formatPokemonName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

/**
 * Format Pokemon ID with leading zeros
 */
export function formatPokemonId(id: number): string {
  return `#${id.toString().padStart(3, "0")}`;
}

/**
 * Convert height from decimeters to meters
 */
export function formatHeight(heightInDecimeters: number): string {
  const meters = heightInDecimeters / 10;
  return `${meters.toFixed(1)} m`;
}

/**
 * Convert weight from hectograms to kilograms
 */
export function formatWeight(weightInHectograms: number): string {
  const kg = weightInHectograms / 10;
  return `${kg.toFixed(1)} kg`;
}
