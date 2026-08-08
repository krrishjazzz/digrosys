"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { gsap, registerGSAP } from "@/lib/gsap";
import { SectionHeading } from "@/components/shared/SectionHeading";
import portfolio from "@/data/portfolio.json";
import {
  PORTFOLIO_FILTERS,
  PORTFOLIO_PREVIEW_COUNT,
} from "@/lib/portfolio-categories";
import { cn } from "@/lib/utils";

type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  video: string | null;
  year: string;
};

function PortfolioCard({ item, index }: { item: PortfolioItem; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  const activate = () => {
    setActive(true);
    void videoRef.current?.play().catch(() => undefined);
  };

  const deactivate = () => {
    setActive(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <article
      className={cn(
        "portfolio-item group relative break-inside-avoid overflow-hidden",
        index % 3 === 0 ? "md:mt-8" : ""
      )}
      data-cursor="hover"
      onMouseEnter={activate}
      onMouseLeave={deactivate}
      onClick={() => (active ? deactivate() : activate())}
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
          className={cn(
            "object-cover transition-transform duration-700",
            active ? "scale-110" : "group-hover:scale-110"
          )}
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
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
              active ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"
            )}
          />
        )}
        <div
          className={cn(
            "absolute inset-0 transition-colors duration-500",
            "bg-gradient-to-t from-black/70 via-black/20 to-transparent",
            active
              ? "md:bg-black/55 md:via-black/55"
              : "md:bg-black/0 md:via-transparent md:group-hover:bg-black/55"
          )}
        />

        <div
          className={cn(
            "absolute inset-0 flex flex-col justify-end p-5 md:p-6 transition-all duration-500",
            "opacity-100 translate-y-0",
            !active &&
              "md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0"
          )}
        >
          <p className="text-[10px] uppercase tracking-[0.22em] text-gold mb-2">
            {item.category} · {item.year}
          </p>
          <h3 className="font-heading text-xl md:text-2xl text-white mb-3 md:mb-4">
            {item.title}
          </h3>
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white border-b border-gold pb-1 w-fit">
            View <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </article>
  );
}

function cloudinaryThumb(url: string, type: "image" | "video") {
  if (type !== "video") return url;
  // Cloudinary video poster frame
  return url
    .replace("/video/upload/", "/video/upload/so_0,f_jpg/")
    .replace(/\.(mp4|mov|webm)$/i, ".jpg");
}

/** SECTION 5 — Portfolio (Cloudinary uploads + JSON fallback) */
export function Portfolio() {
  const [active, setActive] =
    useState<(typeof PORTFOLIO_FILTERS)[number]>("All");
  const [showAll, setShowAll] = useState(false);
  const [remote, setRemote] = useState<PortfolioItem[] | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/media", { cache: "no-store" });
        const json = (await res.json()) as {
          items?: Array<{
            id: string;
            title: string;
            category: string;
            url: string;
            type: "image" | "video";
            createdAt: string;
          }>;
        };
        if (cancelled || !json.items?.length) return;

        const mapped: PortfolioItem[] = json.items.map((item) => ({
          id: item.id,
          title: item.title,
          category: item.category || "Work",
          image:
            item.type === "video"
              ? cloudinaryThumb(item.url, "video")
              : item.url,
          video: item.type === "video" ? item.url : null,
          year: item.createdAt
            ? new Date(item.createdAt).getFullYear().toString()
            : new Date().getFullYear().toString(),
        }));
        setRemote(mapped);
      } catch {
        /* keep JSON fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const source = remote && remote.length > 0 ? remote : portfolio;

  const filtered = useMemo(
    () =>
      active === "All"
        ? source
        : source.filter((p) => p.category === active),
    [active, source]
  );

  const items = useMemo(
    () =>
      showAll ? filtered : filtered.slice(0, PORTFOLIO_PREVIEW_COUNT),
    [filtered, showAll]
  );

  const hasMore = filtered.length > PORTFOLIO_PREVIEW_COUNT;

  const visibleFilters = useMemo(() => {
    const cats = new Set(source.map((p) => p.category));
    return PORTFOLIO_FILTERS.filter((f) => f === "All" || cats.has(f));
  }, [source]);

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

        <div className="-mx-6 mb-12 flex gap-2 overflow-x-auto px-6 pb-2 md:mx-0 md:flex-wrap md:gap-3 md:overflow-visible md:px-0 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {visibleFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => {
                setActive(filter);
                setShowAll(false);
              }}
              className={cn(
                "shrink-0 rounded-full border px-5 py-2.5 min-h-11 text-[11px] uppercase tracking-[0.18em] transition-all duration-300",
                active === filter
                  ? "border-gold bg-gold text-[#111111]"
                  : "border-cream/20 text-cream/65 hover:border-gold/50 hover:text-gold"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <div
          ref={gridRef}
          className="columns-1 gap-4 md:columns-2 xl:columns-3 space-y-4"
        >
          {items.map((item, i) => (
            <PortfolioCard key={item.id} item={item} index={i} />
          ))}
        </div>

        {hasMore && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="inline-flex min-h-12 items-center rounded-full border border-cream/20 px-8 text-[11px] uppercase tracking-[0.18em] text-cream/80 transition-colors hover:border-gold hover:text-gold"
            >
              {showAll
                ? "Show less"
                : `Show all (${filtered.length})`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
