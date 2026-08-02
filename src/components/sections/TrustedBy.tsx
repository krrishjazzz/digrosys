"use client";

import { Marquee } from "@/components/shared/Marquee";
import clients from "@/data/clients.json";

/** SECTION 2 — Infinite logo marquee */
export function TrustedBy() {
  return (
    <section id="trusted" className="relative border-y border-cream/10 bg-mist py-16 md:py-20">
      <p className="mb-10 text-center text-[11px] uppercase tracking-[0.28em] text-cream/50">
        Trusted by ambitious brands
      </p>
      <Marquee speed={35}>
        {clients.map((client) => (
          <div
            key={client.id}
            className="flex h-12 items-center px-4"
            data-cursor="hover"
          >
            <span className="font-heading text-xl md:text-2xl tracking-[0.15em] text-cream/45 hover:text-cream transition-colors whitespace-nowrap">
              {client.name.toUpperCase()}
            </span>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
