"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, registerGSAP } from "@/lib/gsap";
import { SectionHeading } from "@/components/shared/SectionHeading";

const floatingCards = [
  {
    title: "Reel Cut 01",
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&q=80",
    rotate: -8,
    x: "8%",
    y: "12%",
  },
  {
    title: "Meta Ad",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
    rotate: 6,
    x: "72%",
    y: "18%",
  },
  {
    title: "Motion Pack",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    rotate: -4,
    x: "68%",
    y: "62%",
  },
];

/** SECTION 10 — Floating phone + motion graphics showcase */
export function MotionShowcase() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGSAP();
    const ctx = gsap.context(() => {
      gsap.to(".float-card", {
        y: (i) => (i % 2 === 0 ? -40 : 30),
        rotation: (i) => (i % 2 === 0 ? -2 : 3),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".phone-mock", {
        y: -60,
        rotationY: 12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-ink py-28 md:py-40 overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-16">
        <SectionHeading
          eyebrow="Motion"
          title="Content that moves — and sells."
          description="Reels, ads, and motion systems built for the feed."
          align="center"
        />

        <div className="relative mx-auto h-[70vh] max-w-5xl perspective-[1200px]">
          {/* Floating glass / content cards */}
          {floatingCards.map((card) => (
            <div
              key={card.title}
              className="float-card absolute z-10 hidden md:block w-40 lg:w-52 overflow-hidden rounded-xl border border-cream/15 bg-cream/5 backdrop-blur-md shadow-2xl"
              style={{
                left: card.x,
                top: card.y,
                transform: `rotate(${card.rotate}deg)`,
              }}
            >
              <div className="relative aspect-[9/16]">
                <Image src={card.image} alt={card.title} fill className="object-cover" sizes="200px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <p className="absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.15em] text-white">
                  {card.title}
                </p>
              </div>
            </div>
          ))}

          {/* Phone mockup */}
          <div className="phone-mock absolute left-1/2 top-1/2 z-20 w-[240px] md:w-[280px] -translate-x-1/2 -translate-y-1/2 preserve-3d">
            <div className="relative rounded-[2.2rem] border-[3px] border-black/15 bg-[#111] p-2 shadow-[0_40px_80px_rgba(0,0,0,0.18)]">
              <div className="absolute left-1/2 top-3 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-[#111]" />
              <div className="relative aspect-[9/19] overflow-hidden rounded-[1.8rem]">
                <Image
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80"
                  alt="Instagram reel preview"
                  fill
                  className="object-cover"
                  sizes="280px"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/40 to-transparent">
                  <div className="mb-3 h-1 w-full rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full w-2/3 bg-gold animate-pulse" />
                  </div>
                  <p className="text-xs text-white font-medium">@digrosys</p>
                  <p className="text-[10px] text-white/50 mt-1">Growth systems for modern brands</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
