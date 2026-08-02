"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGSAP, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  stagger?: number;
  once?: boolean;
}

/** Character / word mask reveal on scroll */
export function TextReveal({
  children,
  className,
  as: Tag = "h2",
  delay = 0,
  stagger = 0.02,
  once = true,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGSAP();
    const el = ref.current;
    if (!el) return;

    const chars = el.querySelectorAll(".char");
    gsap.set(chars, { yPercent: 110, opacity: 0 });

    const tween = gsap.to(chars, {
      yPercent: 0,
      opacity: 1,
      duration: 0.9,
      stagger,
      delay,
      ease: "power4.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once,
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [children, delay, stagger, once]);

  const words = children.split(" ");

  return (
    <Tag ref={ref as never} className={cn("text-reveal", className)} aria-label={children}>
      {words.map((word, wi) => (
        <span key={`${word}-${wi}`} className="inline-block overflow-hidden mr-[0.3em] last:mr-0 align-top">
          {word.split("").map((char, ci) => (
            <span key={`${wi}-${ci}`} className="char inline-block will-change-transform">
              {char}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
