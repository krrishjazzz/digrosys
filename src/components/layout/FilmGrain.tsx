"use client";

/** Subtle film grain / noise overlay for cinematic texture */
export function FilmGrain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[90] opacity-[0.025] mix-blend-multiply"
      aria-hidden
    >
      <svg className="h-full w-full">
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}
