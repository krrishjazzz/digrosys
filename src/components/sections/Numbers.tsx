"use client";

import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { SectionHeading } from "@/components/shared/SectionHeading";

const stats = [
  { label: "Projects Completed", value: 240, suffix: "+" },
  { label: "Brands Scaled", value: 85, suffix: "+" },
  { label: "ROAS Generated", value: 4.8, suffix: "x", decimals: 1 },
  { label: "Revenue Influenced", value: 120, prefix: "₹", suffix: "Cr+" },
];

/** SECTION 7 — Animated counters */
export function Numbers() {
  return (
    <section className="relative border-y border-cream/10 bg-mist py-28 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-16">
        <SectionHeading
          eyebrow="By the Numbers"
          title="Proof over promises."
          align="center"
          className="mb-20"
        />

        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4 lg:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-5xl md:text-6xl lg:text-7xl text-cream tracking-tight mb-4">
                <AnimatedCounter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals ?? 0}
                />
              </p>
              <p className="text-[11px] uppercase tracking-[0.22em] text-cream/55">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
