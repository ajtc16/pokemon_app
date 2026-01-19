// ============================================
// Authentication Types
// ============================================

export interface User {
  username: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  // Backend may send either expires_at (date string) or expires_in (seconds)
  expires_at?: string;
  expires_in?: number;
  token_type?: string;
  user?: User;
}

export interface AuthState {
  token: string | null;
  expiresAt: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ============================================
// Pokemon API Types
// ============================================

export interface PokemonListItem {
  name: string;
  url: string;
  id?: number;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonMove {
  move: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonForm {
  name: string;
  url: string;
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  back_default: string | null;
  back_shiny: string | null;
  other?: {
    dream_world?: {
      front_default: string | null;
    };
    home?: {
      front_default: string | null;
    };
    "official-artwork"?: {
      front_default: string | null;
      front_shiny: string | null;
    };
  };
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: PokemonType[];
  abilities: PokemonAbility[];
  moves: PokemonMove[];
  stats: PokemonStat[];
  forms: PokemonForm[];
  sprites: PokemonSprites;
}

// ============================================
// UI Types
// ============================================

export type SortOption = "number_asc" | "number_desc" | "name_asc" | "name_desc";

export interface PaginationParams {
  offset: number;
  limit: number;
}

export interface SearchParams extends PaginationParams {
  search?: string;
  sort?: SortOption;
}

// ============================================
// API Error Types
// ============================================

export interface ApiError {
  message: string;
  status: number;
}

// ============================================
// Pokemon Type Colors
// ============================================

export const POKEMON_TYPE_COLORS: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

// ============================================
// Stat Name Mappings
// ============================================

export const STAT_NAMES: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SATK",
  "special-defense": "SDEF",
  speed: "SPD",
};
