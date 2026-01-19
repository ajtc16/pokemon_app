"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthGuard } from "@/components/AuthGuard";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { SortSelect } from "@/components/SortSelect";
import { PokemonCard } from "@/components/PokemonCard";
import { Pagination } from "@/components/Pagination";
import { PokemonGridSkeleton } from "@/components/skeletons/PokemonCardSkeleton";
import { ErrorState } from "@/components/ErrorState";
import { usePokemonList } from "@/hooks/usePokemon";
import { useDebounce } from "@/hooks/useDebounce";
import { extractPokemonId } from "@/lib/api";
import type { SortOption, PokemonListItem } from "@/types";

const ITEMS_PER_PAGE = 20;

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse URL params
  const initialOffset = parseInt(searchParams.get("offset") || "0", 10);
  const initialSearch = searchParams.get("search") || "";
  const initialSort = (searchParams.get("sort") as SortOption) || "number_asc";

  // State
  const [offset, setOffset] = useState(initialOffset);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortOption, setSortOption] = useState<SortOption>(initialSort);

  // Debounced search
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch pokemon list
  const { data, isLoading, isError, error, refetch } = usePokemonList(
    offset,
    ITEMS_PER_PAGE
  );

  // Update URL when params change
  const updateUrl = useCallback(
    (newOffset: number, newSearch: string, newSort: SortOption) => {
      const params = new URLSearchParams();
      params.set("offset", newOffset.toString());
      params.set("limit", ITEMS_PER_PAGE.toString());
      if (newSearch) params.set("search", newSearch);
      params.set("sort", newSort);
      router.push(`/?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  // Sync state with URL when params change
  useEffect(() => {
    updateUrl(offset, debouncedSearch, sortOption);
  }, [offset, debouncedSearch, sortOption, updateUrl]);

  // Process Pokemon data with sorting and filtering
  const processedPokemon = useMemo(() => {
    if (!data?.results) return [];

    // Map results to include extracted IDs
    let pokemon: (PokemonListItem & { id: number })[] = data.results.map(
      (p) => ({
        ...p,
        id: p.id || extractPokemonId(p.url),
      })
    );

    // Filter by search query (client-side for current page)
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase().trim();
      pokemon = pokemon.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.id.toString().includes(query)
      );
    }

    // Sort
    pokemon.sort((a, b) => {
      switch (sortOption) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "number_desc":
          return b.id - a.id;
        case "number_asc":
        default:
          return a.id - b.id;
      }
    });

    return pokemon;
  }, [data?.results, debouncedSearch, sortOption]);

  // Handle page change
  const handlePageChange = (page: number) => {
    const newOffset = page * ITEMS_PER_PAGE;
    setOffset(newOffset);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    // Reset to first page when searching
    if (value !== searchQuery) {
      setOffset(0);
    }
  };

  // Handle sort change
  const handleSortChange = (value: SortOption) => {
    setSortOption(value);
  };

  // Build current URL params for preserving state in detail pages
  const currentParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set("offset", offset.toString());
    params.set("limit", ITEMS_PER_PAGE.toString());
    if (debouncedSearch) params.set("search", debouncedSearch);
    params.set("sort", sortOption);
    return `/?${params.toString()}`;
  }, [offset, debouncedSearch, sortOption]);

  // Calculate current page
  const currentPage = Math.floor(offset / ITEMS_PER_PAGE);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-pokemon-red">
        <Header />

        {/* Search and Sort Bar */}
        <div className="sticky top-[52px] z-10 bg-pokemon-red px-4 pb-3">
          <div className="flex gap-2">
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search"
              className="flex-1"
            />
            <SortSelect value={sortOption} onChange={handleSortChange} />
          </div>
        </div>

        {/* Main Content */}
        <main className="min-h-[calc(100vh-120px)] rounded-t-lg bg-white px-3 py-6 sm:px-4">
          {/* Loading State */}
          {isLoading && <PokemonGridSkeleton count={ITEMS_PER_PAGE} />}

          {/* Error State */}
          {isError && (
            <ErrorState
              type={
                (error as { status?: number })?.status === 503
                  ? "service-unavailable"
                  : "error"
              }
              message={error?.message}
              onRetry={() => refetch()}
            />
          )}

          {/* Empty State (from search) */}
          {!isLoading && !isError && processedPokemon.length === 0 && (
            <ErrorState
              type="empty"
              title="No Pokemon found"
              message={
                debouncedSearch
                  ? `No results for "${debouncedSearch}" on this page`
                  : "No Pokemon available"
              }
            />
          )}

          {/* Pokemon Grid */}
          {!isLoading && !isError && processedPokemon.length > 0 && (
            <>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 sm:gap-3">
                {processedPokemon.map((pokemon) => (
                  <PokemonCard
                    key={pokemon.id}
                    id={pokemon.id}
                    name={pokemon.name}
                    preserveParams={currentParams}
                  />
                ))}
              </div>

              {/* Search Note */}
              {debouncedSearch && (
                <p className="mt-4 text-center font-poppins text-body-3 text-grayscale-medium">
                  Showing results for &quot;{debouncedSearch}&quot; on current
                  page
                </p>
              )}
            </>
          )}

          {/* Pagination */}
          {!isLoading && !isError && data && (
            <Pagination
              currentPage={currentPage}
              totalItems={data.count}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
              className="mt-6"
            />
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
