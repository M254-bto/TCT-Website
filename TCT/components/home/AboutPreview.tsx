"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

interface AboutPreviewProps {
  vision: string;
  mission: string;
  communityStatement: string;
  deep: { letter: string; word: string; description: string }[];
}

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPreview({
  vision,
  mission,
  communityStatement,
  deep,
}: AboutPreviewProps) {
  return (
    <section className="py-24 md:py-32 px-6 md:px-10 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left: Text */}
        <div>
          <FadeIn>
            <p className="text-[#C9A845] text-xs uppercase tracking-[0.2em] font-sans mb-3">
              Who We Are
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="flex items-center gap-4 mb-6">
              <div className="gold-rule shrink-0" />
              <h2 className="font-serif text-4xl md:text-5xl text-[#1C3A2E] leading-tight">
                A Community<br />of the Word
              </h2>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-[#6B7280] leading-relaxed mb-6 text-base md:text-lg">
              {communityStatement}
            </p>
          </FadeIn>

          {/* Vision & Mission pills */}
          <FadeIn delay={0.3}>
            <div className="flex flex-wrap gap-3 mb-10">
              <span className="px-4 py-2 rounded-full border border-[#1C3A2E]/20 text-[#1C3A2E] text-sm font-sans">
                ✦ {vision}
              </span>
              <span className="px-4 py-2 rounded-full bg-[#1C3A2E] text-white text-sm font-sans">
                ✦ {mission}
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 text-[#1C3A2E] font-sans font-medium text-sm border-b border-[#C9A845] pb-0.5 hover:text-[#2D6A4F] transition-colors"
            >
              Learn our full story
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </FadeIn>
        </div>

        {/* Right: DEEP framework */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {deep.map((item, i) => (
            <FadeIn key={item.word} delay={0.1 * i}>
              <div className="group p-6 rounded-2xl border border-[#EAE2D6] hover:border-[#C9A845]/40 hover:bg-[#F4EFE8] transition-all duration-300 h-full">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-serif text-4xl text-[#C9A845] leading-none font-semibold">
                    {item.letter}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-[#1C3A2E] mb-2">{item.word}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{item.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
