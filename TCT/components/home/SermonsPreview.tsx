"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Play, Calendar, ArrowRight } from "lucide-react";
import { formatDateShort } from "@/lib/utils";
import type { Sermon } from "@/lib/content";

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

interface SermonCardProps {
  sermon: Sermon;
  index: number;
}

function SermonCard({ sermon, index }: SermonCardProps) {
  return (
    <FadeIn delay={0.1 * index}>
      <Link
        href={`/sermons/${sermon.slug}`}
        className="group block bg-[#F4EFE8] hover:bg-white rounded-2xl overflow-hidden border border-[#EAE2D6] hover:border-[#C9A845]/40 hover:shadow-xl hover:shadow-[#1C3A2E]/5 transition-all duration-300"
      >
        {/* Cover */}
        <div className="relative h-44 bg-[#1C3A2E] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1C3A2E] to-[#2D6A4F]" />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-[#C9A845] group-hover:border-[#C9A845] transition-all duration-300">
              <Play size={18} className="text-white" fill="currentColor" />
            </div>
          </div>
          {/* Scripture reference ribbon */}
          <div className="absolute bottom-3 left-3 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <span className="text-white/80 text-xs font-sans">{sermon.scripture}</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {sermon.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full bg-[#1C3A2E]/8 text-[#1C3A2E] text-xs font-sans"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="font-serif text-xl text-[#1C3A2E] leading-tight mb-2 group-hover:text-[#2D6A4F] transition-colors">
            {sermon.title}
          </h3>

          <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-2 mb-4">
            {sermon.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-sans font-medium text-[#1C3A2E]">{sermon.preacher}</p>
              <div className="flex items-center gap-1 text-xs text-[#6B7280] mt-0.5">
                <Calendar size={10} />
                {formatDateShort(sermon.date)}
              </div>
            </div>
            <ArrowRight
              size={16}
              className="text-[#C9A845] transition-transform group-hover:translate-x-1"
            />
          </div>
        </div>
      </Link>
    </FadeIn>
  );
}

interface SermonsPreviewProps {
  sermons: Sermon[];
}

export default function SermonsPreview({ sermons }: SermonsPreviewProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-32 px-6 md:px-10 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <motion.p
              ref={ref}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-[#C9A845] text-xs uppercase tracking-[0.2em] font-sans mb-3"
            >
              From the Pulpit
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="gold-rule shrink-0" />
              <h2 className="font-serif text-4xl md:text-5xl text-[#1C3A2E] leading-tight">
                Recent Sermons
              </h2>
            </motion.div>
          </div>
          <Link
            href="/sermons"
            className="group inline-flex items-center gap-2 text-[#1C3A2E] font-sans text-sm font-medium border-b border-[#C9A845] pb-0.5 hover:text-[#2D6A4F] transition-colors shrink-0"
          >
            View all sermons
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sermons.slice(0, 3).map((sermon, i) => (
            <SermonCard key={sermon.slug} sermon={sermon} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
