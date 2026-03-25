import { getSiteConfig } from '@/lib/content'
import PageBanner from '@/components/ui/PageBanner'
import { Section } from '@/components/ui/Section'
import { ContactForm } from '@/components/contact/ContactForm'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us — Trinity Chapel Thika',
  description: 'Get in touch with Trinity Chapel Thika. We would love to hear from you.',
}

export default function ContactPage() {
  const site = getSiteConfig()

  return (
    <>
      <PageBanner
        title="Contact Us"
        subtitle="We would love to hear from you"
        crumbs={[{ label: 'Contact' }]}
      />

      <Section className="bg-[#FAFAF7]">
        <div className="grid lg:grid-cols-5 gap-14 items-start">
          {/* ── Contact Form ──────────────────────────── */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-[#EAE2D6] px-8 py-10">
            <div className="mb-8">
              <h2 className="font-serif text-3xl text-[#1C3A2E] mb-2">Send us a message</h2>
              <p className="text-[#6B7280]">Fill in the form below and we will get back to you shortly.</p>
            </div>
            <ContactForm />
          </div>

          {/* ── Contact Info ──────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Info cards */}
            <div className="rounded-2xl border border-[#EAE2D6] bg-white overflow-hidden">
              <div className="px-6 py-4 border-b border-[#EAE2D6]" style={{ background: '#1C3A2E' }}>
                <h3 className="font-serif text-xl text-white">Find Us</h3>
              </div>
              <div className="divide-y divide-[#EAE2D6]">
                <ContactDetail
                  icon={<MapPin size={16} className="text-[#C9A845]" />}
                  label="Address"
                  value={`${site.address.street}, ${site.address.area}\n${site.address.city}, ${site.address.country}`}
                />
                <ContactDetail
                  icon={<Phone size={16} className="text-[#C9A845]" />}
                  label="Phone"
                  value={site.contact.phone}
                  href={`tel:${site.contact.phone.replace(/\s/g, '')}`}
                />
                <ContactDetail
                  icon={<Mail size={16} className="text-[#C9A845]" />}
                  label="Email"
                  value={site.contact.email}
                  href={`mailto:${site.contact.email}`}
                />
              </div>
            </div>

            {/* Service times */}
            <div className="rounded-2xl border border-[#EAE2D6] bg-white overflow-hidden">
              <div className="px-6 py-4 border-b border-[#EAE2D6]">
                <h3 className="font-serif text-xl text-[#1C3A2E]">Service Times</h3>
              </div>
              <div className="px-6 py-5 space-y-4">
                {site.services.map((service: { name: string; day: string; time: string }) => (
                  <div key={service.name} className="flex items-start gap-3">
                    <Clock size={15} className="text-[#C9A845] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-[#1A1A1A]">{service.name}</div>
                      <div className="text-xs text-[#6B7280]">
                        {service.day} &nbsp;·&nbsp; {service.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map embed placeholder */}
            <div className="rounded-2xl border border-[#EAE2D6] overflow-hidden aspect-video bg-[#EAE2D6] flex items-center justify-center">
              {site.mapEmbed ? (
                <iframe
                  src={site.mapEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Trinity Chapel Thika map"
                />
              ) : (
                <div className="text-center text-[#6B7280] px-6">
                  <MapPin size={28} strokeWidth={1.5} className="mx-auto mb-2" />
                  <p className="text-sm">Mnarani, Thika, Kenya</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}

// ─── Contact Detail Row ───────────────────────────────────────────────────────

function ContactDetail({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}) {
  const text = (
    <>
      <div className="text-[10px] uppercase tracking-widest text-[#6B7280] mb-0.5">{label}</div>
      <div className="text-sm font-medium text-[#1A1A1A] whitespace-pre-line">{value}</div>
    </>
  )
  return (
    <div className="flex items-start gap-3 px-6 py-4">
      <span className="mt-0.5 shrink-0">{icon}</span>
      {href ? (
        <a href={href} className="hover:text-[#2D6A4F] transition-colors">
          {text}
        </a>
      ) : (
        <div>{text}</div>
      )}
    </div>
  )
}
