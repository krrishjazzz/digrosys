"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { gsap, registerGSAP } from "@/lib/gsap";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Button } from "@/components/ui/button";
import { isTouchDevice, scrollToId } from "@/lib/device";

const LINE_1 = "WE DON'T CREATE CONTENT.";
const LINE_2A = "WE BUILD";
const LINE_2B = "GROWTH SYSTEMS.";

function CharSpan({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <span key={i} className="hero-char inline-block overflow-hidden">
          <span className="hero-char-inner inline-block will-change-transform">
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ))}
    </span>
  );
}

/** SECTION 1 — Typography-first hero with editorial visual (no overlapping 3D) */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGSAP();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-char-inner",
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.016,
          ease: "power4.out",
          delay: 0.35,
        }
      );

      gsap.fromTo(
        ".hero-sub, .hero-cta, .hero-scroll, .hero-media",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          delay: 1.1,
        }
      );

      // Subtle media parallax — desktop only (iOS touch parallax feels broken)
      if (isTouchDevice()) return;

      const onMove = (e: MouseEvent) => {
        if (!mediaRef.current) return;
        const x = (e.clientX / window.innerWidth - 0.5) * 16;
        const y = (e.clientY / window.innerHeight - 0.5) * 12;
        gsap.to(mediaRef.current, {
          x,
          y,
          duration: 1.1,
          ease: "power2.out",
        });
      };
      window.addEventListener("mousemove", onMove);
      return () => window.removeEventListener("mousemove", onMove);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] items-center overflow-hidden bg-ink"
    >
      {/* Quiet atmospheric wash — never crosses the type */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 85% 40%, rgba(184,146,42,0.08), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1600px] items-center gap-12 px-6 pt-28 pb-20 md:px-10 lg:grid-cols-12 lg:gap-10 lg:px-16 lg:pt-24">
        {/* Copy — clear column, no visual competition */}
        <div className="lg:col-span-7">
          <h1 className="font-heading max-w-3xl">
            <CharSpan
              text={LINE_1}
              className="block text-xl md:text-3xl lg:text-4xl tracking-[-0.02em] text-cream/65 mb-5 md:mb-7"
            />
            <span className="block text-5xl md:text-7xl lg:text-[5.75rem] leading-[0.95] tracking-[-0.04em] text-cream">
              <CharSpan text={LINE_2A} className="block" />
              <CharSpan text={LINE_2B} className="block text-gold" />
            </span>
          </h1>

          <div className="hero-sub mt-10 md:mt-12 flex flex-wrap gap-x-6 gap-y-2 text-[12px] uppercase tracking-[0.2em] text-cream/60">
            <span>Commercial Production</span>
            <span className="hidden sm:inline text-gold">·</span>
            <span>Performance Marketing</span>
            <span className="hidden sm:inline text-gold">·</span>
            <span>Brand Strategy</span>
          </div>

          <div className="hero-cta mt-12 flex flex-wrap items-center gap-4">
            <MagneticButton size="lg" onClick={() => scrollToId("contact")}>
              Book Discovery Call
            </MagneticButton>
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollToId("portfolio")}
            >
              View Work
            </Button>
          </div>
        </div>

        {/* Editorial visual — sits beside copy, not on top of it */}
        <div className="hero-media relative lg:col-span-5">
          <div
            ref={mediaRef}
            className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden lg:max-w-none will-change-transform"
          >
            <Image
              src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1400&q=85"
              alt="Commercial production set — Digrosys"
              fill
              priority
              className="object-cover"
              sizes="(max-width:1024px) 90vw, 40vw"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/80 mb-1">
                  Studio
                </p>
                <p className="font-heading text-lg text-white">Production × Performance</p>
              </div>
              <span className="text-[11px] tracking-[0.18em] text-gold">01</span>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#trusted"
        className="hero-scroll absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-cream/45 hover:text-gold transition-colors"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <ArrowDown size={16} className="animate-bounce" />
      </a>
    </section>
  );
}
