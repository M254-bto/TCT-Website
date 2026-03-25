import { getSermonBySlug, getSermons } from "@/lib/content";
import { notFound } from "next/navigation";
import PageBanner from "@/components/ui/PageBanner";
import AudioPlayer from "@/components/sermons/AudioPlayer";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Calendar, Tag, BookOpen, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getSermons().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sermon = getSermonBySlug(slug);
  if (!sermon) return {};
  return { title: sermon.title, description: sermon.excerpt };
}

export default async function SermonPage({ params }: Props) {
  const { slug } = await params;
  const sermon = getSermonBySlug(slug);
  if (!sermon) notFound();

  return (
    <>
      <PageBanner
        title={sermon.title}
        subtitle={`${sermon.preacher} · ${formatDate(sermon.date)}`}
        crumbs={[{ label: "Sermons", href: "/sermons" }, { label: sermon.title }]}
      />

      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main */}
            <div className="lg:col-span-2">
              {/* Video embed */}
              {sermon.videoUrl && (
                <div className="aspect-video rounded-2xl overflow-hidden mb-8 bg-[#1C3A2E]">
                  <iframe
                    src={sermon.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={sermon.title}
                  />
                </div>
              )}

              {/* Excerpt / description */}
              <div className="prose max-w-none mb-8">
                <p className="font-serif text-xl text-[#1C3A2E] leading-relaxed">{sermon.excerpt}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {sermon.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4EFE8] text-[#1C3A2E] text-xs font-sans"
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-6">
              {/* Audio player */}
              <AudioPlayer audioUrl={sermon.audioUrl} sermonTitle={sermon.title} />

              {/* Meta */}
              <div className="bg-white rounded-2xl border border-[#EAE2D6] p-5 flex flex-col gap-4">
                <div className="flex items-start gap-2">
                  <Calendar size={15} className="text-[#C9A845] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-[#6B7280] font-sans uppercase tracking-wider mb-0.5">Date</p>
                    <p className="text-sm text-[#1C3A2E] font-sans">{formatDate(sermon.date)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <BookOpen size={15} className="text-[#C9A845] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-[#6B7280] font-sans uppercase tracking-wider mb-0.5">Scripture</p>
                    <p className="text-sm text-[#1C3A2E] font-sans">{sermon.scripture}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#1C3A2E]/15 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[#1C3A2E] text-xs font-serif font-semibold">P</span>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] font-sans uppercase tracking-wider mb-0.5">Preacher</p>
                    <p className="text-sm text-[#1C3A2E] font-sans">{sermon.preacher}</p>
                  </div>
                </div>
                {sermon.series && (
                  <div className="flex items-start gap-2">
                    <Tag size={15} className="text-[#C9A845] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[#6B7280] font-sans uppercase tracking-wider mb-0.5">Series</p>
                      <p className="text-sm text-[#1C3A2E] font-sans">{sermon.series}</p>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/sermons"
                className="inline-flex items-center gap-2 text-sm font-sans text-[#1C3A2E] hover:text-[#2D6A4F] transition-colors"
              >
                <ArrowLeft size={14} />
                Back to all sermons
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
