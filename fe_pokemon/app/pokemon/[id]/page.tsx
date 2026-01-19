"use client";

import { useMemo, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ChevronDown, ChevronUp, Scale, Ruler } from "lucide-react";
import { AuthGuard } from "@/components/AuthGuard";
import { Button } from "@/components/ui/Button";
import { PokemonDetailSkeleton } from "@/components/skeletons/PokemonDetailSkeleton";
import { ErrorState } from "@/components/ErrorState";
import { usePokemonDetail } from "@/hooks/usePokemon";
import {
  formatPokemonName,
  formatPokemonId,
  formatHeight,
  formatWeight,
  getPokemonImageUrl,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { POKEMON_TYPE_COLORS, STAT_NAMES } from "@/types";

const MAX_STAT_VALUE = 255; // Max base stat in Pokemon
const INITIAL_MOVES_COUNT = 10;

export default function PokemonDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const pokemonId = params.id as string;
  const fromUrl = searchParams.get("from");

  const [showAllMoves, setShowAllMoves] = useState(false);

  const { data: pokemon, isLoading, isError, error, refetch } = usePokemonDetail(pokemonId);

  // Get primary type color for theming
  const primaryTypeColor = useMemo(() => {
    if (!pokemon?.types?.[0]) return POKEMON_TYPE_COLORS.normal;
    return POKEMON_TYPE_COLORS[pokemon.types[0].type.name] || POKEMON_TYPE_COLORS.normal;
  }, [pokemon?.types]);

  // Handle back navigation
  const handleBack = () => {
    if (fromUrl) {
      router.push(fromUrl);
    } else {
      router.push("/");
    }
  };

  // Get moves to display
  const displayedMoves = useMemo(() => {
    if (!pokemon?.moves) return [];
    return showAllMoves ? pokemon.moves : pokemon.moves.slice(0, INITIAL_MOVES_COUNT);
  }, [pokemon?.moves, showAllMoves]);

  // Loading state
  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-grayscale-background">
          <PokemonDetailSkeleton />
        </div>
      </AuthGuard>
    );
  }

  // Error state
  if (isError) {
    const status = (error as { status?: number })?.status;
    return (
      <AuthGuard>
        <div className="min-h-screen bg-grayscale-background">
          <header className="flex items-center gap-2 p-4">
            <Button variant="ghost" size="icon" onClick={handleBack} aria-label="Go back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="font-poppins text-subtitle-1">Back</span>
          </header>
          <ErrorState
            type={status === 404 ? "not-found" : status === 503 ? "service-unavailable" : "error"}
            message={status === 404 ? "This Pokemon doesn't exist" : error?.message}
            onRetry={status !== 404 ? () => refetch() : undefined}
          />
        </div>
      </AuthGuard>
    );
  }

  if (!pokemon) return null;

  const imageUrl =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.front_default ||
    getPokemonImageUrl(pokemon.id);

  const formattedName = formatPokemonName(pokemon.name);
  const formattedId = formatPokemonId(pokemon.id);

  return (
    <AuthGuard>
      <div className="min-h-screen" style={{ backgroundColor: primaryTypeColor }}>
        {/* Header */}
        <header className="relative z-10 flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-white hover:bg-white/20"
              aria-label="Go back to list"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="font-poppins text-headline text-white">{formattedName}</h1>
          </div>
          <span className="font-poppins text-subtitle-2 text-white">{formattedId}</span>
        </header>

        {/* Pokemon Image */}
        <div className="relative mx-auto h-48 w-48 sm:h-56 sm:w-56">
          <Image
            src={imageUrl}
            alt={formattedName}
            fill
            sizes="(max-width: 640px) 192px, 224px"
            className="object-contain drop-shadow-lg"
            priority
          />
        </div>

        {/* Content Card */}
        <div className="relative -mt-6 mx-1 min-h-[60vh] rounded-t-3xl bg-white px-5 pt-12 pb-8 shadow-drop-shadow-6dp">
          {/* Type Badges */}
          <div className="mb-4 flex justify-center gap-2">
            {pokemon.types.map(({ type }) => (
              <span
                key={type.name}
                className="type-badge"
                style={{ backgroundColor: POKEMON_TYPE_COLORS[type.name] }}
              >
                {formatPokemonName(type.name)}
              </span>
            ))}
          </div>

          {/* About Section */}
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
              <span className="mt-1 font-poppins text-caption text-grayscale-medium">
                Weight
              </span>
            </div>

            {/* Height */}
            <div className="flex flex-col items-center px-2">
              <div className="flex items-center gap-1">
                <Ruler className="h-4 w-4 text-grayscale-dark" />
                <span className="font-poppins text-body-2 text-grayscale-dark">
                  {formatHeight(pokemon.height)}
                </span>
              </div>
              <span className="mt-1 font-poppins text-caption text-grayscale-medium">
                Height
              </span>
            </div>

            {/* Abilities */}
            <div className="flex flex-col items-center px-2">
              <div className="flex flex-col">
                {pokemon.abilities.slice(0, 2).map(({ ability }) => (
                  <span
                    key={ability.name}
                    className="font-poppins text-body-3 text-grayscale-dark leading-tight"
                  >
                    {formatPokemonName(ability.name.replace("-", " "))}
                  </span>
                ))}
              </div>
              <span className="mt-1 font-poppins text-caption text-grayscale-medium">
                Abilities
              </span>
            </div>
          </div>

          {/* Base Stats Section */}
          <h2
            className="mb-4 text-center font-poppins text-subtitle-1"
            style={{ color: primaryTypeColor }}
          >
            Base Stats
          </h2>

          <div className="space-y-2">
            {pokemon.stats.map(({ base_stat, stat }) => {
              const statName = STAT_NAMES[stat.name] || stat.name.toUpperCase();
              const percentage = (base_stat / MAX_STAT_VALUE) * 100;

              return (
                <div key={stat.name} className="flex items-center gap-2">
                  <span
                    className="w-12 font-poppins text-body-3 font-bold text-right"
                    style={{ color: primaryTypeColor }}
                  >
                    {statName}
                  </span>
                  <div className="w-px h-4 bg-grayscale-light" />
                  <span className="w-8 font-poppins text-body-3 text-grayscale-dark text-right">
                    {base_stat.toString().padStart(3, "0")}
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

          {/* Moves Section */}
          {pokemon.moves.length > 0 && (
            <>
              <h2
                className="mt-6 mb-4 text-center font-poppins text-subtitle-1"
                style={{ color: primaryTypeColor }}
              >
                Moves ({pokemon.moves.length})
              </h2>

              <div className="flex flex-wrap gap-1.5 justify-center">
                {displayedMoves.map(({ move }) => (
                  <span
                    key={move.name}
                    className="rounded-pokemon bg-grayscale-background px-2 py-1 font-poppins text-caption text-grayscale-dark"
                  >
                    {formatPokemonName(move.name.replace("-", " "))}
                  </span>
                ))}
              </div>

              {pokemon.moves.length > INITIAL_MOVES_COUNT && (
                <button
                  onClick={() => setShowAllMoves(!showAllMoves)}
                  className={cn(
                    "mt-3 flex items-center justify-center gap-1 w-full font-poppins text-body-3 transition-colors",
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
                      Show all {pokemon.moves.length} moves{" "}
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </>
          )}

          {/* Forms Section */}
          {pokemon.forms.length > 1 && (
            <>
              <h2
                className="mt-6 mb-4 text-center font-poppins text-subtitle-1"
                style={{ color: primaryTypeColor }}
              >
                Forms ({pokemon.forms.length})
              </h2>

              <div className="flex flex-wrap gap-1.5 justify-center">
                {pokemon.forms.map((form) => (
                  <span
                    key={form.name}
                    className="rounded-pokemon bg-grayscale-background px-2 py-1 font-poppins text-caption text-grayscale-dark"
                  >
                    {formatPokemonName(form.name.replace("-", " "))}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
