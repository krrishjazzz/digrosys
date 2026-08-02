import { Hero } from "@/components/sections/Hero";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { Problem } from "@/components/sections/Problem";
import { Ecosystem } from "@/components/sections/Ecosystem";
import { Portfolio } from "@/components/sections/Portfolio";
import { Process } from "@/components/sections/Process";
import { Numbers } from "@/components/sections/Numbers";
import { CaseStudy } from "@/components/sections/CaseStudy";
import { WhyDigrosys } from "@/components/sections/WhyDigrosys";
import { MotionShowcase } from "@/components/sections/MotionShowcase";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";

/**
 * Digrosys Landing Page
 * Cinematic, award-level composition — 14 sections.
 */
export default function HomePage() {
  return (
    <>
      {/* 01 — Hero */}
      <Hero />

      {/* 02 — Trusted By */}
      <TrustedBy />

      {/* 03 — Problem / Growth System */}
      <Problem />

      {/* 04 — Ecosystem Services */}
      <Ecosystem />

      {/* 05 — Portfolio */}
      <Portfolio />

      {/* 06 — Horizontal Process */}
      <Process />

      {/* 07 — Numbers */}
      <Numbers />

      {/* 08 — Featured Case Study */}
      <CaseStudy />

      {/* 09 — Why Digrosys */}
      <WhyDigrosys />

      {/* 10 — Motion Showcase */}
      <MotionShowcase />

      {/* 11 — Testimonials */}
      <Testimonials />

      {/* 12 — FAQ */}
      <FAQ />

      {/* 13 — Contact */}
      <Contact />

      {/* 14 — Footer rendered in layout */}
    </>
  );
}
