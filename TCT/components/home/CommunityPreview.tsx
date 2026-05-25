"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Calendar, ZoomIn } from "lucide-react";

interface CommunityPhoto {
  slug: string;
  title: string;
  image: string;
  date: string;
}

interface CommunityPreviewProps {
  photos: CommunityPhoto[];
}

export default function CommunityPreview({ photos }: CommunityPreviewProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Handle keyboard navigation for Lightbox
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  const handlePrev = () => {
    setSelectedIndex((prev) =>
      prev === null ? null : prev === 0 ? photos.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedIndex((prev) =>
      prev === null ? null : prev === photos.length - 1 ? 0 : prev + 1
    );
  };

  const activePhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  return (
    <section className="py-24 md:py-32 px-6 md:px-10 bg-cream-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1C3A2E]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C9A845]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[#C9A845] text-xs uppercase tracking-[0.2em] font-sans mb-3 font-semibold"
          >
            Our Fellowship
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="gold-rule shrink-0" />
            <h2 className="font-serif text-4xl md:text-5xl text-[#1C3A2E]">
              Life in Community
            </h2>
            <div className="gold-rule shrink-0" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#6B7280] text-sm md:text-base leading-relaxed"
          >
            We grow deep to reach wide. Experience our fellowship, family moments, and ministries captured in action across our active church community.
          </motion.p>
        </div>

        {/* Pinterest-Style Masonry Grid */}
        <motion.div
          ref={containerRef}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-5 [column-fill:_balance]"
        >
          {photos.map((photo, index) => (
            <motion.div
              key={photo.slug}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
              }}
              onClick={() => setSelectedIndex(index)}
              className="break-inside-avoid mb-5 overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-sm hover:shadow-xl hover:border-[#C9A845]/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative"
            >
              {/* Image */}
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Hover overlay (Pinterest Style) */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2019]/90 via-[#0F2019]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex flex-col justify-end p-5 text-white">
                {/* Zoom Icon indicator */}
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20 transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <ZoomIn size={16} className="text-white" />
                </div>

                <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                  <p className="font-serif text-lg font-semibold mb-1 leading-tight text-[#E2C26A]">
                    {photo.title}
                  </p>
                  
                  <div className="flex items-center gap-1.5 text-[11px] text-white/70">
                    <Calendar size={12} />
                    <span>{new Date(photo.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {photos.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            No community photos added yet. Check back soon!
          </div>
        )}
      </div>

      {/* Lightbox / Gallery Overlay */}
      <AnimatePresence>
        {selectedIndex !== null && activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between text-white w-full max-w-7xl mx-auto py-2 z-10">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-[#E2C26A] font-medium">Gallery</span>
                <span className="text-xs text-white/40">/</span>
                <span className="text-xs text-white/60">{selectedIndex + 1} of {photos.length}</span>
              </div>
              <button
                onClick={() => setSelectedIndex(null)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                title="Close"
              >
                <X size={24} />
              </button>
            </div>

            {/* Middle Section (Content & Navigation) */}
            <div className="flex-1 flex items-center justify-between w-full max-w-7xl mx-auto my-4 relative">
              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-0 md:left-4 z-10 p-3 bg-white/5 backdrop-blur-sm border border-white/10 text-white rounded-full hover:bg-white/15 transition-colors"
                title="Previous Photo"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Main Photo Card */}
              <div className="flex-1 h-full max-h-[70vh] flex items-center justify-center p-4">
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative max-w-full max-h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center bg-zinc-900"
                >
                  <img
                    src={activePhoto.image}
                    alt={activePhoto.title}
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                </motion.div>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-0 md:right-4 z-10 p-3 bg-white/5 backdrop-blur-sm border border-white/10 text-white rounded-full hover:bg-white/15 transition-colors"
                title="Next Photo"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom Bar (Details) */}
            <div className="w-full max-w-3xl mx-auto text-center text-white pb-4 z-10">
              <motion.h3
                key={`title-${selectedIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif text-2xl md:text-3xl text-[#E2C26A] mb-2 font-semibold"
              >
                {activePhoto.title}
              </motion.h3>
              
              <motion.div
                key={`date-${selectedIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                className="flex items-center justify-center gap-2 text-sm text-white/60"
              >
                <Calendar size={14} />
                <span>{new Date(activePhoto.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
