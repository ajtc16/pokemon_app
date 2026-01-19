"use client";

import { cn } from "@/lib/utils";

interface PokemonCardSkeletonProps {
  className?: string;
}

export function PokemonCardSkeleton({ className }: PokemonCardSkeletonProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center rounded-pokemon bg-white p-2 shadow-drop-shadow-2dp animate-pulse",
        className
      )}
      aria-hidden="true"
    >
      {/* ID placeholder */}
      <div className="absolute right-2 top-1 h-3 w-8 rounded bg-grayscale-light" />

      {/* Image placeholder */}
      <div className="h-20 w-20 rounded-pokemon bg-grayscale-light sm:h-24 sm:w-24" />

      {/* Name placeholder */}
      <div className="mt-2 h-4 w-16 rounded bg-grayscale-light" />
    </div>
  );
}

interface PokemonGridSkeletonProps {
  count?: number;
}

export function PokemonGridSkeleton({ count = 20 }: PokemonGridSkeletonProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 sm:gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <PokemonCardSkeleton key={index} />
      ))}
    </div>
  );
}
