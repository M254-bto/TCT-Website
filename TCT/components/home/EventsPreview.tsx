"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, MapPin, ArrowRight, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { ChurchEvent } from "@/lib/content";

const categoryColors: Record<string, string> = {
  Retreat: "bg-[#1C3A2E]/10 text-[#1C3A2E]",
  Youth: "bg-[#C9A845]/15 text-[#A8892E]",
  Community: "bg-[#2D6A4F]/10 text-[#2D6A4F]",
  Conference: "bg-[#1C3A2E]/10 text-[#1C3A2E]",
};

interface EventCardProps {
  event: ChurchEvent;
  index: number;
}

function EventCard({ event, index }: EventCardProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const dateObj = new Date(event.date);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 * index, ease: "easeOut" }}
    >
      <Link
        href={`/events/${event.slug}`}
        className="group flex gap-5 p-5 rounded-2xl border border-[#EAE2D6] bg-white hover:border-[#C9A845]/40 hover:shadow-lg hover:shadow-[#1C3A2E]/5 transition-all duration-300"
      >
        {/* Date badge */}
        <div className="shrink-0 w-14 h-14 rounded-xl bg-[#1C3A2E] flex flex-col items-center justify-center text-white">
          <span className="font-sans text-xl font-bold leading-none">
            {dateObj.getDate()}
          </span>
          <span className="font-sans text-xs uppercase tracking-wider text-[#C9A845]">
            {dateObj.toLocaleString("en", { month: "short" })}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-sans",
                categoryColors[event.category] || "bg-[#6B7280]/10 text-[#6B7280]"
              )}
            >
              {event.category}
            </span>
            {event.status === "past" && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-sans bg-[#6B7280]/10 text-[#6B7280]">
                Past
              </span>
            )}
          </div>
          <h3 className="font-serif text-lg text-[#1C3A2E] leading-snug mb-2 group-hover:text-[#2D6A4F] transition-colors">
            {event.title}
          </h3>
          <div className="flex flex-wrap gap-3 text-xs text-[#6B7280] font-sans">
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {event.time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {event.location}
            </span>
          </div>
        </div>

        <ArrowRight
          size={16}
          className="text-[#C9A845] shrink-0 self-center transition-transform group-hover:translate-x-1"
        />
      </Link>
    </motion.div>
  );
}

interface EventsPreviewProps {
  events: ChurchEvent[];
}

export default function EventsPreview({ events }: EventsPreviewProps) {
  const titleRef = useRef(null);
  const inView = useInView(titleRef, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-32 px-6 md:px-10 bg-[#F4EFE8]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
        {/* Left: header */}
        <div className="lg:col-span-2">
          <motion.p
            ref={titleRef}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[#C9A845] text-xs uppercase tracking-[0.2em] font-sans mb-3"
          >
            What&apos;s Happening
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="gold-rule shrink-0" />
            <h2 className="font-serif text-4xl md:text-5xl text-[#1C3A2E] leading-tight">
              Upcoming Events
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#6B7280] text-base leading-relaxed mb-8"
          >
            Join us for worship, community, and encounters with God throughout the year.
          </motion.p>
          <Link
            href="/events"
            className="group inline-flex items-center gap-2 text-[#1C3A2E] font-sans text-sm font-medium border-b border-[#C9A845] pb-0.5 hover:text-[#2D6A4F] transition-colors"
          >
            View all events
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Right: event list */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {events.slice(0, 4).map((event, i) => (
            <EventCard key={event.slug} event={event} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
