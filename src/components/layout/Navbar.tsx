"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { scrollToId } from "@/lib/device";

const links = [
  { href: "#ecosystem", label: "Services" },
  { href: "#portfolio", label: "Work" },
  { href: "#process", label: "Process" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    // Lenis may emit scroll on a custom path; also poll via rAF-free listener on document
    document.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Lock body scroll when mobile menu is open (iOS-safe)
  useEffect(() => {
    if (!open) return;
    const y = window.scrollY;
    const { body, documentElement } = document;
    const prev = body.style.cssText;
    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";

    return () => {
      body.style.cssText = prev;
      documentElement.style.overflow = "";
      window.scrollTo(0, y);
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    // Allow menu close paint before scroll (iOS)
    window.setTimeout(() => scrollToId(href), 50);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled || open
          ? "bg-ink/95 border-b border-cream/10 py-4 shadow-[0_1px_0_rgba(0,0,0,0.04)] supports-[backdrop-filter]:bg-ink/80 supports-[backdrop-filter]:backdrop-blur-xl"
          : "bg-transparent py-6"
      )}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 md:px-10 lg:px-16">
        <Link
          href="/"
          className="font-heading text-lg md:text-xl tracking-[0.28em] text-cream relative z-10"
          data-cursor="hover"
          onClick={() => setOpen(false)}
        >
          DIGROSYS
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                go(link.href);
              }}
              className="text-[12px] uppercase tracking-[0.18em] text-cream/70 transition-colors hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <MagneticButton
            size="sm"
            onClick={() => go("#contact")}
          >
            Book a Call
          </MagneticButton>
        </div>

        <button
          type="button"
          className="relative z-10 flex h-11 w-11 items-center justify-center lg:hidden text-cream -mr-2"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-[max-height,opacity] duration-400 ease-out bg-ink",
          open ? "max-h-[80dvh] opacity-100 border-b border-cream/10" : "max-h-0 opacity-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                go(link.href);
              }}
              className="min-h-12 flex items-center px-2 text-sm uppercase tracking-[0.2em] text-cream/80 active:text-gold"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              go("#contact");
            }}
            className="min-h-12 flex items-center px-2 text-sm uppercase tracking-[0.2em] text-gold"
          >
            Book a Call
          </a>
        </nav>
      </div>
    </header>
  );
}
