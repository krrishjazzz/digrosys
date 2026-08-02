"use client";

import { TextReveal } from "./TextReveal";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-16 md:mb-24 max-w-4xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-6 text-[11px] uppercase tracking-[0.28em] text-gold">
          {eyebrow}
        </p>
      )}
      <TextReveal
        as="h2"
        className="font-heading text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.03em] text-cream"
      >
        {title}
      </TextReveal>
      {description && (
        <p
          className={cn(
            "mt-8 text-lg md:text-xl text-cream/65 leading-relaxed max-w-2xl",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
