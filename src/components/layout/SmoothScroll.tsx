"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, registerGSAP, ScrollTrigger } from "@/lib/gsap";
import { shouldUseSmoothScroll } from "@/lib/device";

/**
 * Desktop: Lenis + GSAP ScrollTrigger sync.
 * iPhone / touch: native scroll only — Lenis breaks pins, anchors, and fixed nav on iOS.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerGSAP();

    // Always refresh after fonts / layout settle (iOS Safari needs this)
    const refresh = () => ScrollTrigger.refresh();
    const t1 = window.setTimeout(refresh, 300);
    const t2 = window.setTimeout(refresh, 1000);
    window.addEventListener("load", refresh);
    window.addEventListener("orientationchange", refresh);

    if (!shouldUseSmoothScroll()) {
      document.documentElement.classList.add("native-scroll");
      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
        window.removeEventListener("load", refresh);
        window.removeEventListener("orientationchange", refresh);
        document.documentElement.classList.remove("native-scroll");
      };
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });

    // Expose for optional programmatic scroll
    (window as Window & { __lenis?: Lenis }).__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    // Hash / in-page anchors via Lenis
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a[href^='#']");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -80 });
    };
    document.addEventListener("click", onClick);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("load", refresh);
      window.removeEventListener("orientationchange", refresh);
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(ticker);
      delete (window as Window & { __lenis?: Lenis }).__lenis;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
