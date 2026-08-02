"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  Camera,
  Clapperboard,
  Box,
  Palette,
  Sparkles,
  TrendingUp,
  Code2,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import services from "@/data/services.json";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Camera,
  Clapperboard,
  Box,
  Palette,
  Sparkles,
  TrendingUp,
  Code2,
  Layers,
};

function ServiceCard({
  title,
  description,
  icon,
  preview,
}: {
  title: string;
  description: string;
  icon: string;
  preview: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = iconMap[icon] ?? Sparkles;

  const onMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotX = ((y - rect.height / 2) / rect.height) * -10;
    const rotY = ((x - rect.width / 2) / rect.width) * 10;
    el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;
  };

  const onLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform =
        "perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)";
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="hover"
      className={cn(
        "group relative overflow-hidden border border-cream/10 bg-mist/60 p-8 md:p-10",
        "transition-transform duration-300 ease-out will-change-transform"
      )}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Preview on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <Image
          src={preview}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10">
        <div className="service-icon mb-8 inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 text-gold transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-6">
          <Icon size={20} />
        </div>
        <h3 className="font-heading text-2xl text-cream mb-4 tracking-tight transition-colors group-hover:text-white">
          {title}
        </h3>
        <p className="text-cream/65 leading-relaxed text-[15px] transition-colors group-hover:text-white/80">
          {description}
        </p>
      </div>
    </div>
  );
}

/** SECTION 4 — Interactive ecosystem cards */
export function Ecosystem() {
  return (
    <section id="ecosystem" className="relative bg-ink py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-16">
        <SectionHeading
          eyebrow="Our Ecosystem"
          title="Everything your brand needs to scale."
          description="Eight connected capabilities. One accountable partner."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
