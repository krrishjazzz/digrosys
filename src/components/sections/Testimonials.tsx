"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap, registerGSAP } from "@/lib/gsap";
import { SectionHeading } from "@/components/shared/SectionHeading";
import testimonials from "@/data/testimonials.json";
import { cn } from "@/lib/utils";

/** SECTION 11 — 3D rotating testimonial carousel */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = (dir: 1 | -1) => {
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    registerGSAP();
    const el = cardRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { rotateY: 25, opacity: 0, z: -80 },
      { rotateY: 0, opacity: 1, z: 0, duration: 0.7, ease: "power3.out" }
    );
  }, [index]);

  useEffect(() => {
    autoRef.current = setInterval(() => go(1), 5000);
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, []);

  // Duplicate track for infinite marquee feel below
  const loop = [...testimonials, ...testimonials];

  return (
    <section className="relative bg-ink py-28 md:py-40 overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-16">
        <SectionHeading
          eyebrow="Testimonials"
          title="Brands that grew with us."
          align="center"
        />

        <div className="relative mx-auto max-w-3xl perspective-[1200px]">
          <div
            ref={cardRef}
            className="relative border border-cream/10 bg-mist p-10 md:p-16 preserve-3d"
            style={{ transformStyle: "preserve-3d" }}
          >
            <p className="font-heading text-2xl md:text-3xl lg:text-4xl text-cream leading-snug tracking-tight mb-10">
              “{testimonials[index].quote}”
            </p>
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border border-gold/30">
                <Image
                  src={testimonials[index].avatar}
                  alt={testimonials[index].name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div>
                <p className="text-cream font-medium">{testimonials[index].name}</p>
                <p className="text-sm text-cream/45">
                  {testimonials[index].role}, {testimonials[index].company}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-cream/20 text-cream hover:border-gold hover:text-gold transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === index ? "w-8 bg-gold" : "w-1.5 bg-cream/25"
                  )}
                />
              ))}
            </div>
            <button
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-cream/20 text-cream hover:border-gold hover:text-gold transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Infinite name strip */}
        <div className="mt-20 overflow-hidden opacity-40">
          <div className="flex animate-marquee gap-12 whitespace-nowrap">
            {loop.map((t, i) => (
              <span
                key={`${t.id}-${i}`}
                className="font-heading text-xl tracking-[0.15em] text-cream/40"
              >
                {t.company.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
