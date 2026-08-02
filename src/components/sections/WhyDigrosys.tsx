"use client";

import { useEffect, useRef } from "react";
import {
  Brain,
  Film,
  Workflow,
  Zap,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";
import { gsap, registerGSAP } from "@/lib/gsap";
import { SectionHeading } from "@/components/shared/SectionHeading";

const reasons: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Creative Meets Data",
    description: "Every frame is informed by performance signals — beauty with a brief that converts.",
    icon: Brain,
  },
  {
    title: "Production + Marketing",
    description: "One team owns the loop. No agency handoffs. No diluted accountability.",
    icon: Film,
  },
  {
    title: "In-house Workflow",
    description: "Strategy, shoot, edit, and media under one roof — faster cycles, tighter feedback.",
    icon: Workflow,
  },
  {
    title: "Fast Delivery",
    description: "Sprint-based production that keeps pace with platform algorithms and launches.",
    icon: Zap,
  },
  {
    title: "ROI Focused",
    description: "We measure what matters: CAC, ROAS, LTV. Pretty without profit is unfinished work.",
    icon: Target,
  },
  {
    title: "Dedicated Team",
    description: "A senior pod that learns your brand deeply and compounds with every campaign.",
    icon: Users,
  },
];

/** SECTION 9 — Why Digrosys animated cards */
export function WhyDigrosys() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGSAP();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".why-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
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
  }, []);

  return (
    <section id="about" className="relative bg-mist py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-16">
        <SectionHeading
          eyebrow="Why Digrosys"
          title="Not another agency checklist."
          description="Six reasons brands stay — and scale — with us."
        />

        <div ref={gridRef} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reasons.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="why-card group relative overflow-hidden border border-cream/10 p-8 md:p-10 transition-colors duration-500 hover:border-gold/40"
              data-cursor="hover"
            >
              <div className="absolute inset-0 bg-gold/[0.03] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <Icon
                className="mb-8 text-gold transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-3"
                size={28}
              />
              <h3 className="font-heading text-2xl text-cream mb-4">{title}</h3>
              <p className="text-cream/65 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
