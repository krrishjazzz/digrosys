"use client";

import { useState, FormEvent } from "react";
import { Calendar, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { contact } from "@/lib/contact";

const services = [
  "Commercial Photography",
  "Commercial Films",
  "Performance Marketing",
  "Brand Identity",
  "Website Development",
  "Full Growth System",
];

const budgets = [
  "Under ₹2L",
  "₹2L – ₹5L",
  "₹5L – ₹15L",
  "₹15L+",
  "Not sure yet",
];

/** SECTION 13 — Luxury contact form */
export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative bg-ink py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-16">
        <SectionHeading
          eyebrow="Start Here"
          title="Let's build something great."
          description="Tell us about your brand. We'll reply within one business day."
        />

        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Form */}
          <form onSubmit={onSubmit} className="lg:col-span-7 space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" name="company" required placeholder="Brand / company" />
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" required placeholder="+91" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="you@brand.com" />
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <select
                  id="budget"
                  name="budget"
                  required
                  className="flex h-14 w-full border-b border-cream/20 bg-transparent px-0 py-3 text-base text-cream focus:border-gold focus:outline-none transition-colors appearance-none"
                  defaultValue=""
                >
                  <option value="" disabled className="bg-ink">
                    Select budget
                  </option>
                  {budgets.map((b) => (
                    <option key={b} value={b} className="bg-ink">
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="services">Services</Label>
                <select
                  id="services"
                  name="services"
                  required
                  className="flex h-14 w-full border-b border-cream/20 bg-transparent px-0 py-3 text-base text-cream focus:border-gold focus:outline-none transition-colors appearance-none"
                  defaultValue=""
                >
                  <option value="" disabled className="bg-ink">
                    Select service
                  </option>
                  {services.map((s) => (
                    <option key={s} value={s} className="bg-ink">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Project Details</Label>
              <Textarea
                id="details"
                name="details"
                required
                placeholder="Goals, timelines, what success looks like..."
              />
            </div>

            <div className="pt-4">
              <MagneticButton type="submit" size="lg" disabled={submitted}>
                {submitted ? "Message Sent" : "Let's Build Something Great"}
              </MagneticButton>
              {submitted && (
                <p className="mt-4 text-sm text-gold">
                  Thank you — we&apos;ll be in touch shortly.
                </p>
              )}
            </div>
          </form>

          {/* Right side info */}
          <aside className="lg:col-span-5 space-y-10">
            <div className="relative overflow-hidden border border-cream/10 p-8 md:p-10">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/10 blur-2xl" />
              <Calendar className="mb-6 text-gold" size={28} />
              <h3 className="font-heading text-2xl text-cream mb-3">
                Book a Discovery Call
              </h3>
              <p className="text-cream/65 leading-relaxed mb-6">
                30 minutes. No pitch deck theater. A clear look at where growth is leaking — and how we fix it.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={contact.emailHref}
                  className="text-[12px] uppercase tracking-[0.18em] text-gold border-b border-gold/40 pb-1 hover:border-gold transition-colors"
                >
                  Email Us
                </a>
                <a
                  href={contact.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] uppercase tracking-[0.18em] text-gold border-b border-gold/40 pb-1 hover:border-gold transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 text-gold shrink-0" size={18} />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-cream/50 mb-1">
                    Office
                  </p>
                  <p className="text-cream/70">
                    {contact.officeLines.join(", ")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="mt-1 text-gold shrink-0" size={18} />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-cream/50 mb-1">
                    Email
                  </p>
                  <a
                    href={contact.emailHref}
                    className="text-cream/70 hover:text-gold transition-colors"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="mt-1 text-gold shrink-0" size={18} />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-cream/50 mb-1">
                    Phone
                  </p>
                  <a
                    href={contact.phoneHref}
                    className="text-cream/70 hover:text-gold transition-colors"
                  >
                    {contact.phoneDisplay}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MessageCircle className="mt-1 text-gold shrink-0" size={18} />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-cream/50 mb-1">
                    WhatsApp
                  </p>
                  <a
                    href={contact.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream/70 hover:text-gold transition-colors"
                  >
                    {contact.whatsapp}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 w-[18px] shrink-0 text-center text-gold text-xs font-medium">
                  IG
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-cream/50 mb-1">
                    Instagram
                  </p>
                  <a
                    href={contact.instagramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream/70 hover:text-gold transition-colors"
                  >
                    {contact.instagram}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 w-[18px] shrink-0 text-center text-gold text-xs font-medium">
                  FB
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-cream/50 mb-1">
                    Facebook
                  </p>
                  <a
                    href={contact.facebookHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream/70 hover:text-gold transition-colors"
                  >
                    {contact.facebook}
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
