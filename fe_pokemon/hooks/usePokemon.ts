"use client";

import { useQuery } from "@tanstack/react-query";
import { getPokemonList, getPokemonDetail } from "@/lib/api";
import type { PokemonListResponse, PokemonDetail } from "@/types";

/**
 * Query key factory for Pokemon-related queries
 */
export const pokemonKeys = {
  all: ["pokemon"] as const,
  lists: () => [...pokemonKeys.all, "list"] as const,
  list: (offset: number, limit: number) =>
    [...pokemonKeys.lists(), { offset, limit }] as const,
  details: () => [...pokemonKeys.all, "detail"] as const,
  detail: (idOrName: string | number) =>
    [...pokemonKeys.details(), idOrName] as const,
};

/**
 * Hook to fetch paginated Pokemon list
 */
export function usePokemonList(offset: number = 0, limit: number = 20) {
  return useQuery<PokemonListResponse, Error>({
    queryKey: pokemonKeys.list(offset, limit),
    queryFn: () => getPokemonList(offset, limit),
  });
}

/**
 * Hook to fetch Pokemon details
 */
export function usePokemonDetail(idOrName: string | number) {
  return useQuery<PokemonDetail, Error>({
    queryKey: pokemonKeys.detail(idOrName),
    queryFn: () => getPokemonDetail(idOrName),
    enabled: !!idOrName,
  });
}
