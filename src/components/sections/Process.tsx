"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, registerGSAP } from "@/lib/gsap";
import processSteps from "@/data/process.json";
import { isTouchDevice } from "@/lib/device";

/** SECTION 6 — Horizontal pin on desktop; vertical stack on iPhone/touch */
export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // Mobile-first default avoids iOS briefly mounting the pin scroll
  const [mobileLayout, setMobileLayout] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const update = () => setMobileLayout(mq.matches || isTouchDevice());
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (mobileLayout) return;

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
          end: () => `+=${Math.max(track.scrollWidth - window.innerWidth, 1)}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          // Safer for Safari when pin is active
          pinSpacing: true,
        },
      });

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
            end: () => `+=${Math.max(track.scrollWidth - window.innerWidth, 1)}`,
            scrub: 1,
          },
        }
      );

      return () => {
        tween.kill();
      };
    }, section);

    return () => ctx.revert();
  }, [mobileLayout]);

  // —— Mobile / iPhone: readable vertical timeline (no ScrollTrigger pin) ——
  if (mobileLayout) {
    return (
      <section id="process" className="relative bg-ink py-20 overflow-hidden">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold mb-3">
            The Digrosys Process
          </p>
          <h2 className="font-heading text-4xl text-cream tracking-[-0.03em] mb-12">
            How we build growth.
          </h2>

          <ol className="space-y-8">
            {processSteps.map((step) => (
              <li
                key={step.id}
                className="border border-cream/10 bg-mist/50 p-6"
              >
                <div className="mb-4 h-px w-16 bg-gold" />
                <p className="text-[11px] uppercase tracking-[0.25em] text-gold mb-2">
                  Stage {step.id}
                </p>
                <h3 className="font-heading text-3xl text-cream mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-cream/65 leading-relaxed mb-3">
                  {step.description}
                </p>
                <p className="text-[12px] uppercase tracking-[0.18em] text-cream/50">
                  {step.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  // —— Desktop horizontal timeline ——
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
        className="flex h-[100dvh] w-max items-center gap-0 pl-[8vw] pr-[20vw] will-change-transform"
      >
        {processSteps.map((step, i) => (
          <div
            key={step.id}
            className="relative flex h-[60dvh] w-[80vw] md:w-[55vw] lg:w-[40vw] shrink-0 flex-col justify-center px-6 md:px-12"
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
