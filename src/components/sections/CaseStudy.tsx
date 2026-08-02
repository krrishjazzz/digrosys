"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, registerGSAP } from "@/lib/gsap";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { SectionHeading } from "@/components/shared/SectionHeading";

/** SECTION 8 — Featured case study with before/after + charts */
export function CaseStudy() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGSAP();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".chart-bar",
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "bottom",
          stagger: 0.08,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: chartRef.current,
            start: "top 75%",
          },
        }
      );
    }, chartRef);
    return () => ctx.revert();
  }, []);

  const bars = [28, 42, 55, 70, 88, 100];

  return (
    <section className="relative bg-ink py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-16">
        <SectionHeading
          eyebrow="Case Study"
          title="Velvet Bloom — from content to compounding growth."
          description="A beauty brand rebuilt around creative testing and performance systems."
        />

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Before / After visuals */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80"
                alt="Before creative"
                fill
                className="object-cover grayscale"
                sizes="40vw"
              />
              <span className="absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.2em] text-white/80 bg-black/55 px-3 py-1">
                Before
              </span>
            </div>
            <div className="relative aspect-[3/4] overflow-hidden mt-10">
              <Image
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80"
                alt="After creative"
                fill
                className="object-cover"
                sizes="40vw"
              />
              <span className="absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.2em] text-gold bg-black/55 px-3 py-1">
                After
              </span>
            </div>
          </div>

          {/* Metrics + chart */}
          <div>
            <div className="grid grid-cols-3 gap-6 mb-12">
              {[
                { label: "Traffic", value: 3.2, suffix: "x" },
                { label: "Sales", value: 2.7, suffix: "x" },
                { label: "ROAS", value: 5.4, suffix: "x" },
              ].map((m) => (
                <div key={m.label}>
                  <p className="font-heading text-4xl md:text-5xl text-gold mb-2">
                    <AnimatedCounter value={m.value} suffix={m.suffix} decimals={1} />
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-cream/40">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>

            <div ref={chartRef} className="border border-cream/10 p-6 md:p-8">
              <p className="text-[11px] uppercase tracking-[0.2em] text-cream/40 mb-8">
                Monthly performance lift
              </p>
              <div className="flex items-end gap-3 h-40">
                {bars.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="chart-bar w-full bg-gold/80 rounded-sm"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[9px] text-cream/30">M{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
