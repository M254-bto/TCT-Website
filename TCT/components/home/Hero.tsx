"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

interface HeroProps {
  tagline: string;
  subTagline: string;
  scripture: string;
  scriptureRef: string;
}

export default function Hero({ tagline, subTagline, scripture, scriptureRef }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient with subtle pattern */}
      <div
        className="absolute inset-0 bg-[#1C3A2E]"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 60% 40%, #2D6A4F22 0%, transparent 70%),
            radial-gradient(ellipse 60% 80% at 10% 80%, #0F201944 0%, transparent 60%)
          `,
        }}
      />

      {/* Gold accent lines */}
      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-[#C9A845]/40 to-transparent ml-20 hidden lg:block" />
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[#C9A845]/20 to-transparent mr-20 hidden lg:block" />

      {/* Decorative circles */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full border border-[#C9A845]/10 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full border border-[#C9A845]/15 pointer-events-none translate-x-12 translate-y-12" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 text-center py-28">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-[#C9A845] text-xs uppercase tracking-[0.3em] font-sans mb-6"
        >
          {subTagline}
        </motion.p>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-serif text-5xl sm:text-7xl md:text-8xl text-white font-light leading-none tracking-tight mb-8"
        >
          {tagline}
        </motion.h1>

        {/* Gold rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-16 h-0.5 bg-[#C9A845] mx-auto mb-8"
        />

        {/* Scripture */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-serif text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-2 italic"
        >
          &ldquo;{scripture}&rdquo;
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="text-[#C9A845] text-xs tracking-widest font-sans uppercase mb-12"
        >
          — {scriptureRef}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/sermons"
            className="group flex items-center gap-2.5 bg-[#C9A845] text-white px-8 py-3.5 rounded-full font-sans font-medium text-sm hover:bg-[#A8892E] transition-all duration-200 hover:shadow-lg hover:shadow-[#C9A845]/20"
          >
            <Play size={14} fill="currentColor" />
            Watch a Sermon
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-2 border border-white/30 text-white px-8 py-3.5 rounded-full font-sans font-medium text-sm hover:bg-white/10 hover:border-white/60 transition-all duration-200"
          >
            Our Story
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/40 text-xs font-sans tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-[#C9A845]/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}
