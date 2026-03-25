import { getMinistryBySlug, getMinistries } from "@/lib/content";
import { notFound } from "next/navigation";
import PageBanner from "@/components/ui/PageBanner";
import { Clock, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getMinistries().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ministry = getMinistryBySlug(slug);
  if (!ministry) return {};
  return { title: ministry.name, description: ministry.tagline };
}

export default async function MinistryPage({ params }: Props) {
  const { slug } = await params;
  const ministry = getMinistryBySlug(slug);
  if (!ministry) notFound();

  return (
    <>
      <PageBanner
        title={ministry.name}
        subtitle={ministry.tagline}
        crumbs={[{ label: "Ministries", href: "/ministries" }, { label: ministry.name }]}
      />

      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Info sidebar */}
            <div className="md:col-span-1 flex flex-col gap-6">
              <div className="bg-[#F4EFE8] rounded-2xl border border-[#EAE2D6] p-6">
                <h3 className="font-serif text-lg text-[#1C3A2E] mb-4">Ministry Details</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-2">
                    <User size={15} className="text-[#C9A845] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[#6B7280] font-sans uppercase tracking-wider mb-0.5">
                        Ministry Lead
                      </p>
                      <p className="text-sm text-[#1C3A2E] font-sans">{ministry.lead}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock size={15} className="text-[#C9A845] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[#6B7280] font-sans uppercase tracking-wider mb-0.5">
                        Meeting Time
                      </p>
                      <p className="text-sm text-[#1C3A2E] font-sans">{ministry.meetingTime}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-[#1C3A2E] rounded-2xl p-6 text-white">
                <h3 className="font-serif text-lg mb-3">Get Involved</h3>
                <p className="text-white/65 text-sm leading-relaxed mb-5">
                  Interested in joining the {ministry.name}? Reach out to us and we&apos;ll
                  connect you with the team.
                </p>
                <Link
                  href="/contact"
                  className="block text-center bg-[#C9A845] text-white px-5 py-2.5 rounded-full font-sans font-medium text-sm hover:bg-[#A8892E] transition-colors"
                >
                  Contact Us
                </Link>
              </div>

              <Link
                href="/ministries"
                className="inline-flex items-center gap-2 text-sm font-sans text-[#1C3A2E] hover:text-[#2D6A4F] transition-colors"
              >
                <ArrowLeft size={14} />
                All ministries
              </Link>
            </div>

            {/* Main content */}
            <div className="md:col-span-2">
              <div className="gold-rule mb-6" />
              <h2 className="font-serif text-3xl text-[#1C3A2E] mb-5">About This Ministry</h2>
              <p className="text-base md:text-lg text-[#6B7280] leading-relaxed">
                {ministry.description}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
