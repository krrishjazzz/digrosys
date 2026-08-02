"use client";

import { useEffect, useRef } from "react";
import { AtSign, MessageCircle, Users } from "lucide-react";
import { gsap, registerGSAP } from "@/lib/gsap";
import { contact } from "@/lib/contact";

const footerLinks = {
  Studio: [
    { label: "Services", href: "#ecosystem" },
    { label: "Work", href: "#portfolio" },
    { label: "Process", href: "#process" },
    { label: "About", href: "#about" },
  ],
  Connect: [
    { label: "Contact", href: "#contact" },
    { label: "Email", href: contact.emailHref },
    { label: "WhatsApp", href: contact.whatsappHref },
  ],
};

const socials = [
  {
    icon: AtSign,
    href: contact.instagramHref,
    label: `Instagram ${contact.instagram}`,
  },
  {
    icon: Users,
    href: contact.facebookHref,
    label: `Facebook ${contact.facebook}`,
  },
  {
    icon: MessageCircle,
    href: contact.whatsappHref,
    label: "WhatsApp",
  },
];

export function Footer() {
  const brandRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    registerGSAP();
    const el = brandRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: { trigger: el, start: "top 90%" },
      }
    );
  }, []);

  return (
    <footer className="relative border-t border-cream/10 bg-ink pt-24 pb-10 overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-16">
        <div className="grid gap-16 md:grid-cols-12 mb-24">
          <div className="md:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.28em] text-gold mb-6">
              Digrosys
            </p>
            <p className="text-2xl md:text-3xl font-heading text-cream leading-snug max-w-md">
              Commercial production & performance systems for brands that scale.
            </p>
            <a
              href={contact.emailHref}
              className="mt-6 inline-block text-cream/70 hover:text-gold transition-colors"
            >
              {contact.email}
            </a>
          </div>

          {Object.entries(footerLinks).map(([title, items]) => (
            <div key={title} className="md:col-span-2">
              <p className="text-[11px] uppercase tracking-[0.2em] text-cream/50 mb-6">
                {title}
              </p>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-cream/70 hover:text-gold transition-colors"
                      {...(item.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-cream/50 mb-6">
              Social
            </p>
            <div className="flex flex-col gap-4 mb-6 text-sm text-cream/70">
              <a
                href={contact.instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
              >
                Instagram {contact.instagram}
              </a>
              <a
                href={contact.facebookHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
              >
                Facebook {contact.facebook}
              </a>
              <a
                href={contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
              >
                WhatsApp {contact.phoneDisplay}
              </a>
            </div>
            <div className="flex gap-4">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-all hover:border-gold hover:text-gold"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <h2
          ref={brandRef}
          className="font-heading text-[18vw] leading-none tracking-[-0.04em] text-cream/[0.06] select-none text-center"
        >
          DIGROSYS
        </h2>

        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-cream/10 pt-8 text-sm text-cream/45">
          <p>© {new Date().getFullYear()} Digrosys. All rights reserved.</p>
          <p className="text-[11px] uppercase tracking-[0.18em]">
            Production · Performance · Growth
          </p>
        </div>
      </div>
    </footer>
  );
}
