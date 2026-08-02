"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { gsap, registerGSAP } from "@/lib/gsap";
import { SectionHeading } from "@/components/shared/SectionHeading";
import portfolio from "@/data/portfolio.json";
import { cn } from "@/lib/utils";

const filters = ["All", "Fashion", "Food", "Luxury", "Beauty", "Real Estate", "D2C"] as const;

type PortfolioItem = (typeof portfolio)[number];

function PortfolioCard({ item, index }: { item: PortfolioItem; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <article
      className={cn(
        "portfolio-item group relative break-inside-avoid overflow-hidden",
        index % 3 === 0 ? "md:mt-8" : ""
      )}
      data-cursor="hover"
      onMouseEnter={() => {
        void videoRef.current?.play().catch(() => undefined);
      }}
      onMouseLeave={() => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          index % 5 === 0
            ? "aspect-[4/5]"
            : index % 3 === 0
              ? "aspect-square"
              : "aspect-[3/4]"
        )}
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        {item.video && (
          <video
            ref={videoRef}
            src={item.video}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/55" />

        <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
          <p className="text-[10px] uppercase tracking-[0.22em] text-gold mb-2">
            {item.category} · {item.year}
          </p>
          <h3 className="font-heading text-2xl text-white mb-4">{item.title}</h3>
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white border-b border-gold pb-1 w-fit">
            Case Study <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </article>
  );
}

/** SECTION 5 — Masonry portfolio with filters */
export function Portfolio() {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const gridRef = useRef<HTMLDivElement>(null);

  const items = useMemo(
    () =>
      active === "All"
        ? portfolio
        : portfolio.filter((p) => p.category === active),
    [active]
  );

  useEffect(() => {
    registerGSAP();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".portfolio-item",
        { y: 80, opacity: 0, scale: 0.92 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.08,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 75%",
          },
        }
      );
    }, gridRef);
    return () => ctx.revert();
  }, [items]);

  return (
    <section id="portfolio" className="relative bg-ink py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-16">
        <SectionHeading
          eyebrow="Selected Work"
          title="Portfolio"
          description="Campaigns engineered for attention and conversion."
        />

        {/* Filters */}
        <div className="mb-12 flex flex-wrap gap-2 md:gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActive(filter)}
              className={cn(
                "rounded-full border px-5 py-2 text-[11px] uppercase tracking-[0.18em] transition-all duration-300",
                active === filter
                  ? "border-gold bg-gold text-[#111111]"
                  : "border-cream/20 text-cream/65 hover:border-gold/50 hover:text-gold"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Masonry-ish grid */}
        <div
          ref={gridRef}
          className="columns-1 gap-4 md:columns-2 xl:columns-3 space-y-4"
        >
          {items.map((item, i) => (
            <PortfolioCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
