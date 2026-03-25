import { getMinistries } from "@/lib/content";
import PageBanner from "@/components/ui/PageBanner";
import Link from "next/link";
import {
  Music, Compass, Heart, BookOpen, Video, Users, Palette, LucideIcon, ArrowRight, Clock,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ministries",
  description: "Discover the ministries of Trinity Chapel Thika — find your place to serve and belong.",
};

const iconMap: Record<string, LucideIcon> = {
  Music, Compass, Heart, BookOpen, Video, Users, Palette,
};

export default function MinistriesPage() {
  const ministries = getMinistries();

  return (
    <>
      <PageBanner
        title="Ministries"
        subtitle="Every ministry is an expression of our love for God and people. Find your place."
        crumbs={[{ label: "Ministries" }]}
      />

      <section className="py-20 md:py-28 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {ministries.map((ministry) => {
            const Icon = iconMap[ministry.icon] ?? Users;
            return (
              <Link
                key={ministry.slug}
                href={`/ministries/${ministry.slug}`}
                className="group flex flex-col p-7 rounded-2xl border border-[#EAE2D6] bg-white hover:border-[#C9A845]/40 hover:shadow-xl hover:shadow-[#1C3A2E]/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-[#F4EFE8] group-hover:bg-[#1C3A2E] flex items-center justify-center mb-5 transition-colors duration-300">
                  <Icon size={22} className="text-[#1C3A2E] group-hover:text-[#C9A845] transition-colors duration-300" />
                </div>
                <h2 className="font-serif text-2xl text-[#1C3A2E] mb-2 group-hover:text-[#2D6A4F] transition-colors">
                  {ministry.name}
                </h2>
                <p className="text-[#C9A845] text-xs font-sans uppercase tracking-wider mb-3">
                  {ministry.tagline}
                </p>
                <p className="text-sm text-[#6B7280] leading-relaxed flex-1 mb-5">
                  {ministry.description}
                </p>
                <div className="flex items-center justify-between border-t border-[#EAE2D6] pt-4">
                  <div className="flex items-center gap-1.5 text-xs text-[#6B7280] font-sans">
                    <Clock size={11} />
                    {ministry.meetingTime}
                  </div>
                  <ArrowRight size={15} className="text-[#C9A845] transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
