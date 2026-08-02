"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGSAP } from "@/lib/gsap";
import processSteps from "@/data/process.json";

/** SECTION 6 — Horizontal scroll timeline */
export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGSAP();
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // Stage accent lines
      gsap.fromTo(
        ".process-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            scrub: 1,
          },
        }
      );

      return () => {
        tween.kill();
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative bg-ink overflow-hidden"
    >
      <div className="absolute left-6 md:left-10 lg:left-16 top-16 z-10 md:top-24">
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold mb-3">
          The Digrosys Process
        </p>
        <h2 className="font-heading text-4xl md:text-6xl text-cream tracking-[-0.03em]">
          How we build growth.
        </h2>
      </div>

      <div
        ref={trackRef}
        className="flex h-screen w-max items-center gap-0 pl-[8vw] pr-[20vw] will-change-transform"
      >
        {processSteps.map((step, i) => (
          <div
            key={step.id}
            className="relative flex h-[60vh] w-[80vw] md:w-[55vw] lg:w-[40vw] shrink-0 flex-col justify-center px-6 md:px-12"
          >
            <span className="font-heading text-[8rem] md:text-[12rem] leading-none text-cream/[0.06] absolute top-0 left-6 select-none">
              {step.id}
            </span>
            <div className="relative z-10">
              <div className="process-line mb-8 h-px w-24 origin-left bg-gold" />
              <p className="text-[11px] uppercase tracking-[0.25em] text-gold mb-4">
                Stage {step.id}
              </p>
              <h3 className="font-heading text-5xl md:text-7xl text-cream mb-6 tracking-tight">
                {step.title}
              </h3>
              <p className="max-w-md text-lg text-cream/65 leading-relaxed mb-6">
                {step.description}
              </p>
              <p className="text-[12px] uppercase tracking-[0.18em] text-cream/50">
                {step.detail}
              </p>
            </div>

            {/* Motion graphic accent between stages */}
            {i < processSteps.length - 1 && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block">
                <svg width="60" height="20" viewBox="0 0 60 20" aria-hidden>
                  <path
                    d="M0 10 H45 M38 3 L52 10 L38 17"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
