"use client";

import { useState, FormEvent } from "react";
import { Calendar, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { contact } from "@/lib/contact";
import {
  buildWhatsAppEnquiryUrl,
  isMobileDevice,
  openWhatsApp,
  sendEnquiryEmailClient,
  sendEnquirySheetClient,
  type EnquiryPayload,
} from "@/lib/enquiry";

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

const SHEET_WEBHOOK =
  process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL ||
  "";

/** SECTION 13 — Contact form: WhatsApp + email + Google Sheet */
export function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [channelNote, setChannelNote] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setChannelNote("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload: EnquiryPayload = {
      name: String(fd.get("name") || "").trim(),
      company: String(fd.get("company") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      budget: String(fd.get("budget") || "").trim(),
      services: String(fd.get("services") || "").trim(),
      details: String(fd.get("details") || "").trim(),
      source: "website",
    };

    const wa = buildWhatsAppEnquiryUrl(payload);
    setWhatsappUrl(wa);

    // Save lead with keepalive so it still completes if we navigate to WhatsApp
    try {
      void fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    } catch {
      /* ignore */
    }

    // Open WhatsApp immediately (must stay in submit click).
    // Mobile: goes to WhatsApp with message prefilled.
    // Desktop: new tab. WhatsApp never auto-sends — user must tap Send.
    openWhatsApp(wa);

    if (isMobileDevice()) {
      void sendEnquiryEmailClient(payload).catch(() => {});
      if (SHEET_WEBHOOK) {
        void sendEnquirySheetClient(payload, SHEET_WEBHOOK).catch(() => {});
      }
      setStatus("success");
      setChannelNote("WhatsApp opened — tap Send to deliver your enquiry.");
      return;
    }

    setChannelNote(
      "WhatsApp opened with your enquiry prefilled — tap Send in WhatsApp to deliver it."
    );
    setStatus("success");
    form.reset();

    try {
      await sendEnquiryEmailClient(payload);
    } catch (err) {
      console.warn("[enquiry] email", err);
    }
    if (SHEET_WEBHOOK) {
      try {
        await sendEnquirySheetClient(payload, SHEET_WEBHOOK);
      } catch (err) {
        console.warn("[enquiry] sheet", err);
      }
    }
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
          <form onSubmit={onSubmit} className="lg:col-span-7 space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  required
                  placeholder="Brand / company"
                  autoComplete="organization"
                />
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="+91"
                  autoComplete="tel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@brand.com"
                  autoComplete="email"
                />
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

            <div className="pt-4 space-y-4">
              <Button type="submit" size="lg" disabled={status === "loading"}>
                {status === "loading"
                  ? "Sending…"
                  : status === "success"
                    ? "Sent — Submit Another"
                    : "Let's Build Something Great"}
              </Button>

              {status === "success" && (
                <div className="rounded-[16px] border border-gold/30 bg-mist p-5 space-y-3">
                  <p className="text-sm text-cream font-medium">
                    Enquiry saved.
                  </p>
                  <p className="text-sm text-cream/60">{channelNote}</p>
                  <a
                    href={whatsappUrl || contact.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-[12px] font-medium uppercase tracking-[0.12em] text-white"
                  >
                    <MessageCircle size={16} />
                    Open WhatsApp &amp; Send
                  </a>
                  <p className="text-xs text-cream/45">
                    WhatsApp cannot auto-send for security — open the chat and tap{" "}
                    <strong>Send</strong>.
                  </p>
                </div>
              )}

              {status === "error" && (
                <p className="text-sm text-red-600">
                  Something went wrong.{" "}
                  <a
                    href={whatsappUrl || contact.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Message on WhatsApp
                  </a>
                </p>
              )}
            </div>
          </form>

          <aside className="lg:col-span-5 space-y-10">
            <div className="relative overflow-hidden border border-cream/10 p-8 md:p-10">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/10 blur-2xl" />
              <Calendar className="mb-6 text-gold" size={28} />
              <h3 className="font-heading text-2xl text-cream mb-3">
                Book a Discovery Call
              </h3>
              <p className="text-cream/65 leading-relaxed mb-6">
                30 minutes. No pitch deck theater. A clear look at where growth is
                leaking — and how we fix it.
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
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
