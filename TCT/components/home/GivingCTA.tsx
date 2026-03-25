"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

export default function GivingCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-32 px-6 md:px-10 bg-[#1C3A2E] overflow-hidden relative">
      {/* Decorative */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#C9A845]/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#C9A845]/8 pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.p
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-[#C9A845] text-xs uppercase tracking-[0.25em] font-sans mb-4"
        >
          Partner With Us
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif text-4xl md:text-6xl text-white leading-tight mb-6"
        >
          Support the Mission in Thika
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-12 h-0.5 bg-[#C9A845] mx-auto mb-6"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-white/65 text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto font-sans"
        >
          Your generosity fuels the WIDE vision — reaching 100,000 people in Thika County
          with the life-changing message of Jesus Christ.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/give"
            className="group flex items-center gap-2.5 bg-[#C9A845] text-white px-8 py-3.5 rounded-full font-sans font-medium text-sm hover:bg-[#A8892E] transition-all duration-200 hover:shadow-lg hover:shadow-[#C9A845]/20"
          >
            Give Now
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-2 border border-white/25 text-white px-8 py-3.5 rounded-full font-sans font-medium text-sm hover:bg-white/8 hover:border-white/50 transition-all duration-200"
          >
            Learn About Our Vision
          </Link>
        </motion.div>

        {/* Scripture */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 font-serif text-white/40 text-sm italic"
        >
          &ldquo;Each of you should give what you have decided in your heart to give, not reluctantly
          or under compulsion, for God loves a cheerful giver.&rdquo; — 2 Corinthians 9:7
        </motion.p>
      </div>
    </section>
  );
}
