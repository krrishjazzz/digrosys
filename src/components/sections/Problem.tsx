"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGSAP } from "@/lib/gsap";
import { SectionHeading } from "@/components/shared/SectionHeading";

const agencySteps = ["Photography", "Video", "Social Media", "Done."];
const digrosysSteps = [
  "Strategy",
  "Production",
  "Creative",
  "Performance Ads",
  "Analytics",
  "Growth",
];

/** SECTION 3 — Agencies stop. Digrosys systems continue. */
export function Problem() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGSAP();
    const ctx = gsap.context(() => {
      // Break apart old agency flow
      gsap.to(".agency-step", {
        x: (i) => (i % 2 === 0 ? -40 : 40),
        y: (i) => i * 8,
        rotation: (i) => (i % 2 === 0 ? -6 : 6),
        opacity: 0.35,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".agency-col",
          start: "top 60%",
          end: "bottom 40%",
          scrub: 1,
        },
      });

      // Digrosys path builds
      gsap.fromTo(
        ".dig-step",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".dig-col",
            start: "top 70%",
            end: "center 50%",
            scrub: 1,
          },
        }
      );

      // SVG connector draw
      gsap.fromTo(
        ".dig-path",
        { strokeDashoffset: 400 },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".dig-col",
            start: "top 70%",
            end: "bottom 50%",
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-ink py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-16">
        <SectionHeading
          eyebrow="The Problem"
          title="Most agencies stop here."
          description="They deliver assets. We deliver a growth system that compounds."
        />

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left — broken agency funnel */}
          <div className="agency-col relative rounded-sm border border-cream/10 p-8 md:p-12">
            <p className="mb-10 text-[11px] uppercase tracking-[0.22em] text-cream/55">
              Typical Agency
            </p>
            <ul className="space-y-0">
              {agencySteps.map((step, i) => (
                <li key={step} className="agency-step">
                  <div className="flex items-center gap-4 py-4">
                    <span className="font-heading text-3xl md:text-4xl text-cream/70">
                      {step}
                    </span>
                  </div>
                  {i < agencySteps.length - 1 && (
                    <div className="ml-2 h-8 w-px bg-cream/15" />
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — Digrosys system */}
          <div className="dig-col relative rounded-sm border border-gold/30 bg-mist p-8 md:p-12 overflow-hidden">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/10 blur-3xl" />
            <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-gold">
              Digrosys
            </p>
            <p className="mb-10 font-heading text-2xl text-cream">The Growth Loop</p>

            <svg
              className="absolute left-12 top-36 h-[70%] w-px opacity-40"
              viewBox="0 0 2 400"
              preserveAspectRatio="none"
              aria-hidden
            >
              <line
                className="dig-path"
                x1="1"
                y1="0"
                x2="1"
                y2="400"
                stroke="#D4AF37"
                strokeWidth="2"
                strokeDasharray="400"
              />
            </svg>

            <ul className="relative space-y-0">
              {digrosysSteps.map((step, i) => (
                <li key={step} className="dig-step">
                  <div className="flex items-center gap-5 py-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/40 text-[10px] text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-heading text-2xl md:text-3xl text-cream">
                      {step}
                    </span>
                  </div>
                  {i < digrosysSteps.length - 1 && (
                    <div className="ml-4 h-5 w-px bg-gold/20" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
