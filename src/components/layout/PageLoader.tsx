"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/** Logo morph loading screen */
export function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
      const timer = setTimeout(() => setVisible(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="relative flex flex-col items-center">
            <motion.div
              className="overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: "auto" }}
              transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
            >
              <motion.h1
                className="font-heading text-4xl md:text-6xl tracking-[0.35em] text-cream whitespace-nowrap"
                initial={{ opacity: 0, letterSpacing: "0.6em" }}
                animate={{ opacity: 1, letterSpacing: "0.35em" }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              >
                DIGROSYS
              </motion.h1>
            </motion.div>

            <motion.div
              className="mt-8 h-px w-40 origin-left bg-gold"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.4 }}
            />

            <motion.p
              className="mt-6 text-[10px] uppercase tracking-[0.4em] text-cream/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              Growth Systems
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
