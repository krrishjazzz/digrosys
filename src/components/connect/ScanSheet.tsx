"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Download, MessageCircle, X } from "lucide-react";
import { contact } from "@/lib/contact";

/** Auto bottom sheet after QR scan — Save / WhatsApp / Book */
export function ScanSheet() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const key = "digrosys-connect-sheet";
    try {
      if (sessionStorage.getItem(key)) return;
    } catch {
      /* private mode */
    }

    const t = window.setTimeout(() => {
      setOpen(true);
      try {
        sessionStorage.setItem(key, "1");
      } catch {
        /* ignore */
      }
    }, 1000);

    return () => window.clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Dismiss"
            className="fixed inset-0 z-[60] bg-black/25"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="scan-sheet-title"
            className="fixed inset-x-0 bottom-0 z-[70] mx-auto max-w-lg rounded-t-[28px] border border-black/5 bg-white/95 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[0_-20px_60px_rgba(0,0,0,0.12)] backdrop-blur-xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
          >
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-black/10" />
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p id="scan-sheet-title" className="font-heading text-xl text-[#111] tracking-tight">
                  Thanks for scanning my business card.
                </p>
                <p className="mt-2 text-sm text-[#111]/65">
                  Save my contact or message me — I&apos;d love to connect.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/5 text-[#111]/70"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid gap-3">
              <a
                href={contact.vcfHref}
                download
                className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#B08A1B] px-4 text-[13px] font-medium uppercase tracking-[0.12em] text-white active:scale-[0.98] transition-transform"
              >
                <Download size={16} />
                Save Contact
              </a>
              <a
                href={contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-4 text-[13px] font-medium uppercase tracking-[0.12em] text-[#111] active:scale-[0.98] transition-transform"
              >
                <MessageCircle size={16} />
                WhatsApp Me
              </a>
              <a
                href={contact.bookHref}
                className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-black/10 bg-[#F6F6F4] px-4 text-[13px] font-medium uppercase tracking-[0.12em] text-[#111] active:scale-[0.98] transition-transform"
              >
                <Calendar size={16} />
                Book a Call
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
