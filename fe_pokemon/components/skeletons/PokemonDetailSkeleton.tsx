"use client";

export function PokemonDetailSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      {/* Header */}
      <div className="h-56 bg-grayscale-light rounded-b-3xl" />

      {/* Content Card */}
      <div className="relative -mt-12 mx-1 rounded-pokemon bg-white p-4 shadow-drop-shadow-2dp">
        {/* Types */}
        <div className="mb-4 flex justify-center gap-2">
          <div className="h-6 w-16 rounded-full bg-grayscale-light" />
          <div className="h-6 w-16 rounded-full bg-grayscale-light" />
        </div>

        {/* About section title */}
        <div className="mx-auto mb-4 h-5 w-16 rounded bg-grayscale-light" />

        {/* About stats */}
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="h-5 w-16 rounded bg-grayscale-light" />
            <div className="h-3 w-12 rounded bg-grayscale-light" />
          </div>
          <div className="flex flex-col items-center gap-2 border-x border-grayscale-light px-4">
            <div className="h-5 w-16 rounded bg-grayscale-light" />
            <div className="h-3 w-12 rounded bg-grayscale-light" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-5 w-16 rounded bg-grayscale-light" />
            <div className="h-3 w-12 rounded bg-grayscale-light" />
          </div>
        </div>

        {/* Description */}
        <div className="mb-4 space-y-2">
          <div className="h-3 w-full rounded bg-grayscale-light" />
          <div className="h-3 w-5/6 rounded bg-grayscale-light" />
          <div className="h-3 w-4/6 rounded bg-grayscale-light" />
        </div>

        {/* Base Stats title */}
        <div className="mx-auto mb-4 h-5 w-24 rounded bg-grayscale-light" />

        {/* Stats */}
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="h-4 w-12 rounded bg-grayscale-light" />
              <div className="h-4 w-8 rounded bg-grayscale-light" />
              <div className="h-3 flex-1 rounded-full bg-grayscale-light" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
