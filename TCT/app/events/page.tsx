import { getEvents } from '@/lib/content'
import PageBanner from '@/components/ui/PageBanner'
import { Section } from '@/components/ui/Section'
import { isUpcoming, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Calendar, Clock, MapPin, ArrowRight, Tag } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Events — Trinity Chapel Thika',
  description: 'Stay connected with what is happening at Trinity Chapel Thika. Conferences, retreats, fellowships and more.',
}

export default function EventsPage() {
  const events = getEvents()
  const upcoming = events.filter((e) => isUpcoming(e.endDate ?? e.date))
  const past = events.filter((e) => !isUpcoming(e.endDate ?? e.date))

  return (
    <>
      <PageBanner
        title="Events"
        subtitle="Stay connected with what God is doing in our community"
        crumbs={[{ label: 'Events' }]}
      />

      <Section className="bg-[#FAFAF7]">
        {/* Upcoming Events */}
        {upcoming.length > 0 && (
          <div className="mb-16">
            {/* section eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A845]">Upcoming</span>
              <div className="h-px flex-1 bg-[#EAE2D6]" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {past.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#6B7280]">Past Events</span>
              <div className="h-px flex-1 bg-[#EAE2D6]" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 opacity-80">
              {past.map((event) => (
                <EventCard key={event.slug} event={event} isPast />
              ))}
            </div>
          </div>
        )}

        {events.length === 0 && (
          <div className="py-24 text-center">
            <Calendar className="mx-auto mb-4 text-[#C9A845]" size={40} strokeWidth={1.5} />
            <p className="text-lg text-[#6B7280]">No events at the moment. Check back soon!</p>
          </div>
        )}
      </Section>
    </>
  )
}

// ─── Event Card ──────────────────────────────────────────────────────────────

interface EventCardProps {
  event: {
    slug: string
    title: string
    date: string
    endDate?: string
    time?: string
    location?: string
    category?: string
    description?: string
    excerpt?: string
  }
  isPast?: boolean
}

function EventCard({ event, isPast = false }: EventCardProps) {
  const d = new Date(event.date)
  const day = d.toLocaleDateString('en-KE', { day: '2-digit' })
  const month = d.toLocaleDateString('en-KE', { month: 'short' }).toUpperCase()
  const year = d.getFullYear()

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex flex-col rounded-2xl border border-[#EAE2D6] bg-white overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Date Badge Header */}
      <div
        className="flex items-center gap-4 px-6 py-5"
        style={{ background: isPast ? '#6B7280' : '#1C3A2E' }}
      >
        <div className="text-center min-w-[3rem]">
          <div className="text-3xl font-bold leading-none text-white font-serif">{day}</div>
          <div className="text-xs font-semibold tracking-widest mt-0.5" style={{ color: '#C9A845' }}>{month}</div>
          <div className="text-xs text-white/60 mt-0.5">{year}</div>
        </div>
        <div className="h-10 w-px bg-white/20" />
        <div className="flex-1 min-w-0">
          {event.category && (
            <span
              className="inline-block text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full mb-1"
              style={{ background: 'rgba(201,168,69,0.2)', color: '#C9A845' }}
            >
              {event.category}
            </span>
          )}
          {event.time && (
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <Clock size={12} />
              <span>{event.time}</span>
            </div>
          )}
        </div>
        {isPast && (
          <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/60">
            Past
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 py-5">
        <h3 className="font-serif text-xl text-[#1A1A1A] leading-snug mb-2 group-hover:text-[#1C3A2E] transition-colors">
          {event.title}
        </h3>
        {event.location && (
          <div className="flex items-center gap-1.5 text-[#6B7280] text-sm mb-3">
            <MapPin size={13} />
            <span>{event.location}</span>
          </div>
        )}
        {(event.excerpt || event.description) && (
          <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-3 flex-1">
            {event.excerpt || event.description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-[#6B7280]">{formatDate(event.date)}</span>
          <span
            className="flex items-center gap-1 text-sm font-medium transition-colors"
            style={{ color: isPast ? '#6B7280' : '#1C3A2E' }}
          >
            Details
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  )
}
