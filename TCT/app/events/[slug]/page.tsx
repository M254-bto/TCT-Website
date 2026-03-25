import { getEvents, getEventBySlug } from '@/lib/content'
import PageBanner from '@/components/ui/PageBanner'
import { Section } from '@/components/ui/Section'
import { isUpcoming, formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, MapPin, ArrowLeft, Tag, Users } from 'lucide-react'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const events = getEvents()
  return events.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const event = getEventBySlug(slug)
  if (!event) return {}
  return {
    title: `${event.title} — Trinity Chapel Thika`,
    description: event.excerpt || event.description,
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = getEventBySlug(slug)
  if (!event) notFound()

  const upcoming = isUpcoming(event.endDate ?? event.date)
  const d = new Date(event.date)
  const day = d.toLocaleDateString('en-KE', { day: '2-digit' })
  const month = d.toLocaleDateString('en-KE', { month: 'long' })
  const year = d.getFullYear()

  return (
    <>
      <PageBanner
        title={event.title}
        subtitle={formatDate(event.date) + (event.endDate ? ` – ${formatDate(event.endDate)}` : '')}
        crumbs={[{ label: 'Events', href: '/events' }, { label: event.title }]}
      />

      <Section className="bg-[#FAFAF7]">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* ── Sidebar ───────────────────────────────── */}
          <aside className="lg:col-span-1 order-2 lg:order-1 space-y-6">
            {/* Event details card */}
            <div className="rounded-2xl border border-[#EAE2D6] bg-white overflow-hidden">
              {/* date header */}
              <div className="px-6 py-5 text-white" style={{ background: upcoming ? '#1C3A2E' : '#6B7280' }}>
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-5xl font-bold leading-none">{day}</span>
                  <div>
                    <div className="font-serif text-lg leading-tight">{month}</div>
                    <div className="text-sm text-white/70">{year}</div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-5 space-y-4">
                {event.category && (
                  <div className="flex items-center gap-3">
                    <Tag size={15} className="text-[#C9A845] shrink-0" />
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-[#6B7280] mb-0.5">Category</div>
                      <div className="text-sm font-medium text-[#1A1A1A]">{event.category}</div>
                    </div>
                  </div>
                )}

                {event.time && (
                  <div className="flex items-center gap-3">
                    <Clock size={15} className="text-[#C9A845] shrink-0" />
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-[#6B7280] mb-0.5">Time</div>
                      <div className="text-sm font-medium text-[#1A1A1A]">{event.time}</div>
                    </div>
                  </div>
                )}

                {event.location && (
                  <div className="flex items-center gap-3">
                    <MapPin size={15} className="text-[#C9A845] shrink-0" />
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-[#6B7280] mb-0.5">Location</div>
                      <div className="text-sm font-medium text-[#1A1A1A]">{event.location}</div>
                    </div>
                  </div>
                )}

                {/* Status badge */}
                <div className="pt-2 border-t border-[#EAE2D6]">
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full"
                    style={
                      upcoming
                        ? { background: 'rgba(44,106,79,0.1)', color: '#2D6A4F' }
                        : { background: 'rgba(107,114,128,0.1)', color: '#6B7280' }
                    }
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: upcoming ? '#2D6A4F' : '#6B7280' }}
                    />
                    {upcoming ? 'Upcoming' : 'Past Event'}
                  </span>
                </div>
              </div>
            </div>

            {/* Register / Join CTA — only for upcoming */}
            {upcoming && (
              <div
                className="rounded-2xl px-6 py-7 text-white text-center"
                style={{ background: '#1C3A2E' }}
              >
                <Users size={28} className="mx-auto mb-3 opacity-80" />
                <h3 className="font-serif text-xl mb-2">Join Us</h3>
                <p className="text-sm text-white/70 mb-5 leading-relaxed">
                  We would love to have you. Reach out to us to confirm your attendance or ask any questions.
                </p>
                <Link
                  href="/contact"
                  className="inline-block w-full rounded-full py-2.5 text-sm font-semibold text-[#1C3A2E] bg-[#C9A845] hover:bg-[#A8892E] transition-colors text-center"
                >
                  Get in Touch
                </Link>
              </div>
            )}

            {/* Back link */}
            <Link
              href="/events"
              className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1C3A2E] transition-colors"
            >
              <ArrowLeft size={15} />
              Back to all events
            </Link>
          </aside>

          {/* ── Main Content ──────────────────────────── */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {event.excerpt && (
              <p className="font-serif text-2xl text-[#1C3A2E] leading-relaxed mb-8 pb-8 border-b border-[#EAE2D6]">
                {event.excerpt}
              </p>
            )}

            {event.description && (
              <div className="prose prose-slate max-w-none text-[#1A1A1A]">
                <p className="text-lg leading-relaxed text-[#1A1A1A]/80">{event.description}</p>
              </div>
            )}

            {/* What to expect callout */}
            <div
              className="mt-10 rounded-2xl px-6 py-6 border-l-4"
              style={{ background: '#F4EFE8', borderColor: '#C9A845' }}
            >
              <h4 className="font-serif text-lg text-[#1C3A2E] mb-2">What to Expect</h4>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Our events are designed to foster community, deepen faith, and create lasting memories. 
                Come as you are — all are welcome at Trinity Chapel Thika.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
