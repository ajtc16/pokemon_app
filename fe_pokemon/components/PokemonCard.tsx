"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPokemonName, formatPokemonId, getPokemonImageUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

interface PokemonCardProps {
  id: number;
  name: string;
  className?: string;
  preserveParams?: string;
}

export function PokemonCard({ id, name, className, preserveParams }: PokemonCardProps) {
  const imageUrl = getPokemonImageUrl(id);
  const formattedName = formatPokemonName(name);
  const formattedId = formatPokemonId(id);

  const href = preserveParams
    ? `/pokemon/${id}?from=${encodeURIComponent(preserveParams)}`
    : `/pokemon/${id}`;

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col items-center rounded-pokemon bg-white p-2 shadow-drop-shadow-2dp transition-all hover:shadow-drop-shadow-6dp hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pokemon-red",
        className
      )}
      aria-label={`View details for ${formattedName}, ${formattedId}`}
    >
      {/* Pokemon Number */}
      <span className="absolute right-2 top-1 font-poppins text-caption text-grayscale-medium">
        {formattedId}
      </span>

      {/* Pokemon Image */}
      <div className="relative h-20 w-20 bg-grayscale-background rounded-pokemon overflow-hidden sm:h-24 sm:w-24">
        <Image
          src={imageUrl}
          alt={formattedName}
          fill
          sizes="(max-width: 640px) 80px, 96px"
          className="object-contain p-2 transition-transform group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* Pokemon Name */}
      <span className="mt-1 font-poppins text-body-3 text-grayscale-dark sm:text-body-2">
        {formattedName}
      </span>
    </Link>
  );
}
