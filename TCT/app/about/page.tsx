import { getSiteConfig } from "@/lib/content";
import PageBanner from "@/components/ui/PageBanner";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Trinity Chapel Thika — our vision to Grow DEEP in the Word and Reach WIDE for Christ.",
};

export default function AboutPage() {
  const site = getSiteConfig();

  return (
    <>
      <PageBanner
        title="About Us"
        subtitle="Loving, Caring and Serving the People of Thika"
        crumbs={[{ label: "About Us" }]}
      />

      {/* Vision & Mission */}
      <section className="py-20 md:py-28 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="p-8 rounded-2xl bg-[#1C3A2E] text-white">
            <p className="text-[#C9A845] text-xs uppercase tracking-[0.2em] font-sans mb-3">Vision</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-4">{site.vision}</h2>
            <p className="text-white/65 text-sm leading-relaxed font-sans">
              Everything we do is orientated around growing deeper in a personal relationship with
              Jesus Christ and his Word. Depth precedes fruitfulness.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-[#F4EFE8] border border-[#EAE2D6]">
            <p className="text-[#C9A845] text-xs uppercase tracking-[0.2em] font-sans mb-3">Mission</p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1C3A2E] mb-4">{site.mission}</h2>
            <p className="text-[#6B7280] text-sm leading-relaxed font-sans">
              Rooted in the Word, TC Thika exists to reach every pocket of this county — and
              beyond — with the transforming gospel of Jesus Christ.
            </p>
          </div>
        </div>
      </section>

      {/* Community statement */}
      <section className="py-16 px-6 md:px-10 bg-[#FAFAF7]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="gold-rule mx-auto mb-6" />
          <p className="font-serif text-2xl md:text-3xl text-[#1C3A2E] leading-relaxed italic">
            &ldquo;{site.communityStatement}&rdquo;
          </p>
        </div>
      </section>

      {/* DEEP */}
      <section className="py-20 md:py-28 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-[#C9A845] text-xs uppercase tracking-[0.2em] font-sans mb-3">How We Grow</p>
            <div className="flex items-center gap-4">
              <div className="gold-rule shrink-0" />
              <h2 className="font-serif text-4xl md:text-5xl text-[#1C3A2E]">The D.E.E.P Life</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {site.deep.map((item, i) => (
              <div
                key={item.letter + i}
                className="p-7 rounded-2xl border border-[#EAE2D6] hover:border-[#C9A845]/40 hover:bg-[#F4EFE8] transition-all duration-300"
              >
                <span className="font-serif text-5xl text-[#C9A845] leading-none block mb-3">
                  {item.letter}
                </span>
                <h3 className="font-serif text-xl text-[#1C3A2E] mb-3">{item.word}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WIDE */}
      <section className="py-20 md:py-28 px-6 md:px-10 bg-[#1C3A2E]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-[#C9A845] text-xs uppercase tracking-[0.2em] font-sans mb-3">How We Reach</p>
            <div className="flex items-center gap-4">
              <div className="gold-rule shrink-0" />
              <h2 className="font-serif text-4xl md:text-5xl text-white">The W.I.D.E Vision</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {site.wide.map((item, i) => (
              <div
                key={item.letter + i}
                className="p-7 rounded-2xl border border-white/10 hover:border-[#C9A845]/30 hover:bg-white/5 transition-all duration-300"
              >
                <span className="font-serif text-5xl text-[#C9A845] leading-none block mb-3">
                  {item.letter}
                </span>
                <h3 className="font-serif text-xl text-white mb-3">{item.word}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service schedule */}
      <section className="py-20 md:py-28 px-6 md:px-10 bg-[#F4EFE8]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-[#C9A845] text-xs uppercase tracking-[0.2em] font-sans mb-3">Join Us</p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#1C3A2E]">Service Times</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {site.services.map((s) => (
              <div key={s.name} className="p-7 rounded-2xl bg-white border border-[#EAE2D6] text-center">
                <div className="gold-rule mx-auto mb-4" />
                <h3 className="font-serif text-xl text-[#1C3A2E] mb-2">{s.name}</h3>
                <p className="text-[#C9A845] font-sans text-sm font-medium mb-2">{s.time}</p>
                <p className="text-[#6B7280] text-xs font-sans">{s.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 md:py-28 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-[#C9A845] text-xs uppercase tracking-[0.2em] font-sans mb-3">Our Team</p>
            <div className="flex items-center gap-4">
              <div className="gold-rule shrink-0" />
              <h2 className="font-serif text-4xl md:text-5xl text-[#1C3A2E]">Leadership</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {site.leadership.map((person) => (
              <div key={person.name} className="group">
                <div className="aspect-square rounded-2xl bg-[#F4EFE8] border border-[#EAE2D6] mb-4 overflow-hidden flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#1C3A2E]/15 flex items-center justify-center">
                    <span className="font-serif text-2xl text-[#1C3A2E]">
                      {person.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <p className="text-[#C9A845] text-xs uppercase tracking-wider font-sans mb-0.5">
                  {person.role}
                </p>
                <h3 className="font-serif text-xl text-[#1C3A2E] mb-2">{person.name}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed mb-3">{person.bio}</p>
                <div className="flex gap-2">
                  {person.socials.twitter && person.socials.twitter !== "#" && (
                    <a
                      href={person.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                      className="w-8 h-8 rounded-full border border-[#EAE2D6] flex items-center justify-center hover:border-[#1C3A2E] hover:text-[#1C3A2E] text-[#6B7280] transition-colors"
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                  {person.socials.instagram && person.socials.instagram !== "#" && (
                    <a
                      href={person.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="w-8 h-8 rounded-full border border-[#EAE2D6] flex items-center justify-center hover:border-[#1C3A2E] hover:text-[#1C3A2E] text-[#6B7280] transition-colors"
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
