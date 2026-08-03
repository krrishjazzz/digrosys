"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Phone,
  MessageCircle,
  Mail,
  Globe,
  Calendar,
  Download,
  MapPin,
  Camera,
  Clapperboard,
  Sparkles,
  Code2,
  TrendingUp,
  Palette,
  Box,
  Layers,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { contact } from "@/lib/contact";
import portfolio from "@/data/portfolio.json";
import { ScanSheet } from "./ScanSheet";
import {
  InstagramIcon,
  LinkedInIcon,
  FacebookIcon,
  PinterestIcon,
  YouTubeIcon,
} from "./SocialIcons";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const actions: {
  label: string;
  href: string;
  icon: LucideIcon;
  primary?: boolean;
  external?: boolean;
  download?: boolean;
}[] = [
  { label: "Call", href: contact.phoneHref, icon: Phone, primary: true },
  {
    label: "WhatsApp",
    href: contact.whatsappHref,
    icon: MessageCircle,
    primary: true,
    external: true,
  },
  { label: "Email", href: contact.emailHref, icon: Mail },
  {
    label: "Visit Website",
    href: contact.website,
    icon: Globe,
    external: true,
  },
  { label: "Book a Discovery Call", href: contact.bookHref, icon: Calendar },
  {
    label: "Save Contact",
    href: contact.vcfHref,
    icon: Download,
    download: true,
  },
];

const serviceCards: { title: string; icon: LucideIcon }[] = [
  { title: "Commercial Photography", icon: Camera },
  { title: "Commercial Films", icon: Clapperboard },
  { title: "Brand Identity", icon: Sparkles },
  { title: "Website Development", icon: Code2 },
  { title: "Performance Marketing", icon: TrendingUp },
  { title: "Creative Direction", icon: Palette },
  { title: "3D Product Rendering", icon: Box },
  { title: "Content Strategy", icon: Layers },
];

const socials = [
  { href: contact.instagramHref, label: "Instagram", Icon: InstagramIcon },
  { href: contact.linkedinHref, label: "LinkedIn", Icon: LinkedInIcon },
  { href: contact.facebookHref, label: "Facebook", Icon: FacebookIcon },
  { href: contact.pinterestHref, label: "Pinterest", Icon: PinterestIcon },
  { href: contact.youtubeHref, label: "YouTube", Icon: YouTubeIcon },
];

const featured = portfolio.slice(0, 8);

export function ConnectCard() {
  return (
    <div className="connect-page min-h-[100dvh] bg-white text-[#111]">
      <div className="mx-auto max-w-lg px-5 pb-16 pt-10 sm:px-6">
        {/* Hero */}
        <motion.header
          className="text-center"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.p
            variants={fadeUp}
            custom={0}
            className="font-heading text-sm tracking-[0.35em] text-[#111]"
          >
            DIGROSYS
          </motion.p>
          <motion.div
            variants={fadeUp}
            custom={1}
            className="mx-auto mt-4 h-px w-10 bg-[#B08A1B]"
          />
          <motion.h1
            variants={fadeUp}
            custom={2}
            className="mt-8 font-heading text-3xl sm:text-4xl tracking-[-0.03em] text-[#111]"
          >
            {contact.founder}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            custom={3}
            className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[#B08A1B]"
          >
            {contact.title}
          </motion.p>
          <motion.p
            variants={fadeUp}
            custom={4}
            className="mx-auto mt-6 max-w-sm text-[15px] leading-relaxed text-[#111]/65"
          >
            {contact.tagline}
          </motion.p>
        </motion.header>

        {/* Primary actions */}
        <motion.section
          className="mt-10 grid gap-3"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.25 } } }}
        >
          {actions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.a
                key={action.label}
                variants={fadeUp}
                custom={i}
                href={action.href}
                {...(action.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                {...(action.download ? { download: true } : {})}
                className={cn(
                  "flex min-h-[52px] items-center justify-center gap-2.5 rounded-[20px] px-5 text-[13px] font-medium uppercase tracking-[0.12em] transition-all active:scale-[0.98]",
                  action.primary
                    ? "bg-[#B08A1B] text-white shadow-[0_10px_30px_rgba(176,138,27,0.25)] hover:bg-[#c49a2a]"
                    : "border border-black/8 bg-[#F7F7F5] text-[#111] hover:border-[#B08A1B]/40 hover:bg-white"
                )}
              >
                <Icon size={17} strokeWidth={1.75} />
                {action.label}
              </motion.a>
            );
          })}
        </motion.section>

        {/* Contact details */}
        <motion.section
          className="mt-10 rounded-[20px] border border-black/6 bg-[#F7F7F5] p-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#B08A1B] mb-5">
            Contact
          </p>
          <ul className="space-y-5">
            <li>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#111]/40 mb-1">
                Phone
              </p>
              <a href={contact.phoneHref} className="text-[16px] text-[#111] hover:text-[#B08A1B]">
                {contact.phoneDisplay}
              </a>
            </li>
            <li>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#111]/40 mb-1">
                Email
              </p>
              <a href={contact.emailHref} className="text-[16px] text-[#111] hover:text-[#B08A1B] break-all">
                {contact.email}
              </a>
            </li>
            <li>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#111]/40 mb-1">
                Website
              </p>
              <a
                href={contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[16px] text-[#111] hover:text-[#B08A1B]"
              >
                {contact.website}
              </a>
            </li>
            <li>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#111]/40 mb-1">
                Office
              </p>
              <address className="not-italic text-[15px] leading-relaxed text-[#111]/75">
                {contact.officeLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </li>
          </ul>
        </motion.section>

        {/* Social icons only */}
        <motion.section
          className="mt-8 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-black/8 bg-white text-[#111] transition-all hover:border-[#B08A1B] hover:text-[#B08A1B] active:scale-95"
            >
              <Icon />
            </a>
          ))}
        </motion.section>

        {/* About */}
        <motion.section
          className="mt-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#B08A1B] mb-3">
            Who We Are
          </p>
          <h2 className="font-heading text-2xl tracking-tight text-[#111] mb-4">
            About DIGROSYS
          </h2>
          <p className="text-[15px] leading-relaxed text-[#111]/65">
            {contact.about}
          </p>
        </motion.section>

        {/* Services */}
        <motion.section
          className="mt-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#B08A1B] mb-3">
            Capabilities
          </p>
          <h2 className="font-heading text-2xl tracking-tight text-[#111] mb-6">
            Our Services
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {serviceCards.map(({ title, icon: Icon }) => (
              <div
                key={title}
                className="rounded-[20px] border border-black/6 bg-[#F7F7F5] p-4 transition-colors hover:border-[#B08A1B]/35"
              >
                <Icon size={18} className="text-[#B08A1B] mb-3" strokeWidth={1.6} />
                <p className="font-heading text-[14px] leading-snug text-[#111]">
                  {title}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Portfolio preview */}
        <motion.section
          className="mt-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
        >
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#B08A1B] mb-2">
                Selected Work
              </p>
              <h2 className="font-heading text-2xl tracking-tight text-[#111]">
                Portfolio
              </h2>
            </div>
          </div>

          <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {featured.map((item) => (
              <article
                key={item.id}
                className="relative h-52 w-40 shrink-0 snap-start overflow-hidden rounded-[20px]"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-[9px] uppercase tracking-[0.16em] text-[#B08A1B] mb-1">
                    {item.category}
                  </p>
                  <p className="font-heading text-sm text-white leading-tight">
                    {item.title}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <Link
            href="/#portfolio"
            className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-[20px] border border-black/10 text-[13px] uppercase tracking-[0.12em] text-[#111] hover:border-[#B08A1B] hover:text-[#B08A1B] transition-colors"
          >
            View Full Portfolio
            <ArrowUpRight size={15} />
          </Link>
        </motion.section>

        {/* Maps */}
        <motion.section
          className="mt-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#B08A1B] mb-3">
            Visit Us
          </p>
          <h2 className="font-heading text-2xl tracking-tight text-[#111] mb-5">
            Office
          </h2>
          <div className="overflow-hidden rounded-[20px] border border-black/6">
            <iframe
              title="DIGROSYS Office Location"
              src={contact.mapsEmbedUrl}
              className="h-56 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <a
            href={contact.mapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-[20px] bg-[#111] text-[13px] uppercase tracking-[0.12em] text-white hover:bg-[#222] transition-colors"
          >
            <MapPin size={16} />
            Get Directions
          </a>
        </motion.section>

        {/* Closing */}
        <motion.footer
          className="mt-14 border-t border-black/6 pt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-[14px] leading-relaxed text-[#111]/55">
            Thanks for connecting with DIGROSYS.
            <br />
            We look forward to building something exceptional together.
          </p>
          <p className="mt-6 font-heading text-xs tracking-[0.28em] text-[#111]/25">
            DIGROSYS
          </p>
        </motion.footer>
      </div>

      <ScanSheet />
    </div>
  );
}
