"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Music,
  Compass,
  Heart,
  BookOpen,
  Video,
  Users,
  Palette,
  ArrowRight,
  LucideIcon,
} from "lucide-react";
import type { Ministry } from "@/lib/content";

const iconMap: Record<string, LucideIcon> = {
  Music,
  Compass,
  Heart,
  BookOpen,
  Video,
  Users,
  Palette,
};

interface MinistryCardProps {
  ministry: Ministry;
  index: number;
}

function MinistryCard({ ministry, index }: MinistryCardProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = iconMap[ministry.icon] ?? Users;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.07 * index, ease: "easeOut" }}
    >
      <Link
        href={`/ministries/${ministry.slug}`}
        className="group flex flex-col p-7 rounded-2xl border border-[#EAE2D6] bg-white hover:bg-[#1C3A2E] hover:border-[#1C3A2E] hover:shadow-xl hover:shadow-[#1C3A2E]/15 transition-all duration-350 h-full"
      >
        <div className="w-12 h-12 rounded-full bg-[#F4EFE8] group-hover:bg-white/15 flex items-center justify-center mb-5 transition-colors duration-300">
          <Icon size={22} className="text-[#1C3A2E] group-hover:text-[#C9A845] transition-colors duration-300" />
        </div>
        <h3 className="font-serif text-xl text-[#1C3A2E] group-hover:text-white mb-2 transition-colors duration-300">
          {ministry.name}
        </h3>
        <p className="text-sm text-[#6B7280] group-hover:text-white/65 leading-relaxed flex-1 transition-colors duration-300">
          {ministry.tagline}
        </p>
        <div className="flex items-center gap-1.5 mt-4 text-[#C9A845] text-xs font-sans font-medium">
          Learn more
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  );
}

interface MinistriesPreviewProps {
  ministries: Ministry[];
}

export default function MinistriesPreview({ ministries }: MinistriesPreviewProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-32 px-6 md:px-10 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <motion.p
              ref={ref}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-[#C9A845] text-xs uppercase tracking-[0.2em] font-sans mb-3"
            >
              Get Involved
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="gold-rule shrink-0" />
              <h2 className="font-serif text-4xl md:text-5xl text-[#1C3A2E] leading-tight">
                Ministries
              </h2>
            </motion.div>
          </div>
          <Link
            href="/ministries"
            className="group inline-flex items-center gap-2 text-[#1C3A2E] font-sans text-sm font-medium border-b border-[#C9A845] pb-0.5 hover:text-[#2D6A4F] transition-colors shrink-0"
          >
            All ministries
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {ministries.slice(0, 4).map((ministry, i) => (
            <MinistryCard key={ministry.slug} ministry={ministry} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
