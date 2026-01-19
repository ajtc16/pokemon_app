"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ChevronDown, ChevronUp, Ruler, Scale } from "lucide-react";

import { AuthGuard } from "@/components/AuthGuard";
import { Button } from "@/components/ui/Button";
import { PokemonDetailSkeleton } from "@/components/skeletons/PokemonDetailSkeleton";
import { ErrorState } from "@/components/ErrorState";

import { usePokemonDetail } from "@/hooks/usePokemon";
import { cn } from "@/lib/utils";
import { POKEMON_TYPE_COLORS } from "@/types";

// --- helpers (local + safe) ---
const formatPokemonName = (name?: string) =>
  (name ?? "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const formatPokemonId = (id?: number) => `#${String(id ?? "").padStart(3, "0")}`;

const formatHeight = (height?: number) => {
  // your API height is probably in decimeters (like PokeAPI). 4 => 0.4m
  if (height == null) return "-";
  return `${(height / 10).toFixed(1)} m`;
};

const formatWeight = (weight?: number) => {
  // your API weight is probably in hectograms (like PokeAPI). 60 => 6.0kg
  if (weight == null) return "-";
  return `${(weight / 10).toFixed(1)} kg`;
};

const MAX_STAT_VALUE = 255;
const INITIAL_MOVES_COUNT = 10; // your API doesn’t return moves right now, but keeping it won’t hurt

type ApiPokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience?: number;
  types: string[]; // ✅ strings
  abilities: { name: string; is_hidden: boolean }[];
  sprites: {
    front_default?: string;
    official_artwork?: string;
  };
  stats: Record<string, number>; // ✅ object map
};

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SpA",
  "special-defense": "SpD",
  speed: "SPD",
};

export default function PokemonDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const pokemonId = params.id as string;
  const fromUrl = searchParams.get("from");

  const [showAllMoves, setShowAllMoves] = useState(false);

  const {
    data: pokemonRaw,
    isLoading,
    isError,
    error,
    refetch,
  } = usePokemonDetail(pokemonId);

  const pokemon = pokemonRaw as ApiPokemon | undefined;

  // ✅ FIX: types are strings in your API
  const primaryTypeColor = useMemo(() => {
    const typeName = pokemon?.types?.[0]; // "electric"
    if (!typeName) return POKEMON_TYPE_COLORS.normal;
    return (POKEMON_TYPE_COLORS as any)[typeName] ?? POKEMON_TYPE_COLORS.normal;
  }, [pokemon?.types]);

  const handleBack = () => {
    if (fromUrl) router.push(fromUrl);
    else router.push("/");
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-grayscale-background">
          <PokemonDetailSkeleton />
        </div>
      </AuthGuard>
    );
  }

  if (isError) {
    const status = (error as any)?.status;

    return (
      <AuthGuard>
        <div className="min-h-screen bg-grayscale-background">
          <header className="flex items-center gap-2 p-4">
            <Button variant="ghost" size="icon" onClick={handleBack} aria-label="Go back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="font-poppins text-subtitle-1">Back</span>
          </header>

          <div className="px-4">
            <ErrorState status={status} message={(error as any)?.message} onRetry={refetch} />
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (!pokemon) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-grayscale-background">
          <header className="flex items-center gap-2 p-4">
            <Button variant="ghost" size="icon" onClick={handleBack} aria-label="Go back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="font-poppins text-subtitle-1">Back</span>
          </header>

          <div className="px-4">
            <ErrorState status={404} message="Pokemon not found." onRetry={refetch} />
          </div>
        </div>
      </AuthGuard>
    );
  }

  const formattedName = formatPokemonName(pokemon.name);
  const formattedId = formatPokemonId(pokemon.id);

  const imageUrl =
    pokemon.sprites?.official_artwork ||
    pokemon.sprites?.front_default ||
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="; // tiny fallback

  const statEntries = Object.entries(pokemon.stats ?? {}).map(([key, value]) => ({
    key,
    label: STAT_LABELS[key] ?? key.toUpperCase(),
    value,
  }));

  // moves: your API doesn’t return moves yet, so keep empty
  const moves: { name: string }[] = [];
  const displayedMoves = showAllMoves ? moves : moves.slice(0, INITIAL_MOVES_COUNT);

  return (
    <AuthGuard>
      <div
        className="min-h-screen bg-grayscale-background"
        style={{
          background: `linear-gradient(180deg, ${primaryTypeColor}20 0%, #F6F8FC 40%)`,
        }}
      >
        {/* Header */}
        <header className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleBack} aria-label="Go back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="font-poppins text-subtitle-1">Back</span>
          </div>

          <span className="font-poppins text-body-2 text-grayscale-medium">{formattedId}</span>
        </header>

        <div className="mx-auto max-w-md px-4 pb-10">
          {/* Name + Image */}
          <div className="relative mb-6 rounded-pokemon bg-white p-4 shadow-card">
            <h1
              className="mb-3 text-center font-poppins text-headline-1"
              style={{ color: primaryTypeColor }}
            >
              {formattedName}
            </h1>

            <div className="relative mx-auto h-48 w-48">
              <Image src={imageUrl} alt={formattedName} fill sizes="192px" priority />
            </div>

            {/* Types */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {(pokemon.types ?? []).map((typeName) => (
                <span
                  key={typeName}
                  className="rounded-pokemon px-3 py-1 font-poppins text-body-3 text-white"
                  style={{
                    backgroundColor:
                      (POKEMON_TYPE_COLORS as any)[typeName] ?? POKEMON_TYPE_COLORS.normal,
                  }}
                >
                  {formatPokemonName(typeName)}
                </span>
              ))}
            </div>
          </div>

          {/* About */}
          <h2
            className="mb-4 text-center font-poppins text-subtitle-1"
            style={{ color: primaryTypeColor }}
          >
            About
          </h2>

          <div className="mb-4 grid grid-cols-3 divide-x divide-grayscale-light">
            {/* Weight */}
            <div className="flex flex-col items-center px-2">
              <div className="flex items-center gap-1">
                <Scale className="h-4 w-4 text-grayscale-dark" />
                <span className="font-poppins text-body-2 text-grayscale-dark">
                  {formatWeight(pokemon.weight)}
                </span>
              </div>
              <span className="mt-1 font-poppins text-caption text-grayscale-medium">Weight</span>
            </div>

            {/* Height */}
            <div className="flex flex-col items-center px-2">
              <div className="flex items-center gap-1">
                <Ruler className="h-4 w-4 text-grayscale-dark" />
                <span className="font-poppins text-body-2 text-grayscale-dark">
                  {formatHeight(pokemon.height)}
                </span>
              </div>
              <span className="mt-1 font-poppins text-caption text-grayscale-medium">Height</span>
            </div>

            {/* Abilities */}
            <div className="flex flex-col items-center px-2">
              <div className="flex flex-col">
                {(pokemon.abilities ?? []).slice(0, 2).map((a) => (
                  <span
                    key={a.name}
                    className="font-poppins text-body-3 leading-tight text-grayscale-dark"
                  >
                    {formatPokemonName(a.name)}
                  </span>
                ))}
              </div>
              <span className="mt-1 font-poppins text-caption text-grayscale-medium">Abilities</span>
            </div>
          </div>

          {/* Base Stats */}
          <h2
            className="mb-4 text-center font-poppins text-subtitle-1"
            style={{ color: primaryTypeColor }}
          >
            Base Stats
          </h2>

          <div className="space-y-2">
            {statEntries.map(({ key, label, value }) => {
              const percentage = Math.min(100, (value / MAX_STAT_VALUE) * 100);

              return (
                <div key={key} className="flex items-center gap-2">
                  <span
                    className="w-12 text-right font-poppins text-body-3 font-bold"
                    style={{ color: primaryTypeColor }}
                  >
                    {label}
                  </span>
                  <div className="h-4 w-px bg-grayscale-light" />
                  <span className="w-8 text-right font-poppins text-body-3 text-grayscale-dark">
                    {String(value).padStart(3, "0")}
                  </span>

                  <div className="stat-bar flex-1">
                    <div
                      className="stat-bar-fill"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: primaryTypeColor,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Moves (your API doesn't return moves yet) */}
          {moves.length > 0 && (
            <>
              <h2
                className="mt-6 mb-4 text-center font-poppins text-subtitle-1"
                style={{ color: primaryTypeColor }}
              >
                Moves ({moves.length})
              </h2>

              <div className="flex flex-wrap justify-center gap-1.5">
                {displayedMoves.map((m) => (
                  <span
                    key={m.name}
                    className="rounded-pokemon bg-grayscale-background px-2 py-1 font-poppins text-caption text-grayscale-dark"
                  >
                    {formatPokemonName(m.name)}
                  </span>
                ))}
              </div>

              {moves.length > INITIAL_MOVES_COUNT && (
                <button
                  onClick={() => setShowAllMoves(!showAllMoves)}
                  className={cn(
                    "mt-3 flex w-full items-center justify-center gap-1 font-poppins text-body-3 transition-colors"
                  )}
                  style={{ color: primaryTypeColor }}
                  aria-expanded={showAllMoves}
                >
                  {showAllMoves ? (
                    <>
                      Show less <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Show all {moves.length} moves <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
