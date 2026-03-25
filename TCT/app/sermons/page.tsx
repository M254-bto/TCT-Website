import { getSermons } from "@/lib/content";
import PageBanner from "@/components/ui/PageBanner";
import Link from "next/link";
import { Play, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sermons",
  description: "Explore sermon archives from Trinity Chapel Thika — audio, video, and notes.",
};

export default function SermonsPage() {
  const sermons = getSermons();

  return (
    <>
      <PageBanner
        title="Sermons"
        subtitle="Right teachings of the scriptures — audio, video, and notes."
        crumbs={[{ label: "Sermons" }]}
      />

      <section className="py-20 md:py-28 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {sermons.map((sermon) => (
              <Link
                key={sermon.slug}
                href={`/sermons/${sermon.slug}`}
                className="group flex flex-col bg-white rounded-2xl border border-[#EAE2D6] hover:border-[#C9A845]/40 hover:shadow-xl hover:shadow-[#1C3A2E]/5 overflow-hidden transition-all duration-300"
              >
                {/* Header art */}
                <div className="relative h-40 bg-gradient-to-br from-[#1C3A2E] to-[#2D6A4F] flex items-center justify-center overflow-hidden">
                  <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-[#C9A845] group-hover:border-[#C9A845] transition-all duration-300">
                    <Play size={20} className="text-white" fill="currentColor" />
                  </div>
                  <div className="absolute top-3 left-3 text-[#C9A845] text-xs font-sans bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    {sermon.series}
                  </div>
                  <div className="absolute bottom-3 right-3 text-white/70 text-xs font-sans">
                    {sermon.scripture}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {sermon.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full bg-[#F4EFE8] text-[#1C3A2E] text-xs font-sans"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="font-serif text-xl text-[#1C3A2E] leading-snug mb-2 group-hover:text-[#2D6A4F] transition-colors flex-1">
                    {sermon.title}
                  </h2>
                  <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-2 mb-4">
                    {sermon.excerpt}
                  </p>
                  <div className="flex items-center justify-between border-t border-[#EAE2D6] pt-4 mt-auto">
                    <div>
                      <p className="text-sm font-sans font-medium text-[#1C3A2E]">{sermon.preacher}</p>
                      <div className="flex items-center gap-1 text-xs text-[#6B7280] mt-0.5">
                        <Calendar size={10} />
                        {formatDate(sermon.date)}
                      </div>
                    </div>
                    <span className="text-xs font-sans text-[#C9A845] group-hover:underline">
                      Listen →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
