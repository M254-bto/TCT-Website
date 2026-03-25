import { getSiteConfig } from '@/lib/content'
import PageBanner from '@/components/ui/PageBanner'
import { Section } from '@/components/ui/Section'
import Link from 'next/link'
import { Heart, Smartphone, Building2, Mail } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Give — Trinity Chapel Thika',
  description: 'Support the mission and vision of Trinity Chapel Thika through your generous giving.',
}

export default function GivePage() {
  const site = getSiteConfig()

  return (
    <>
      <PageBanner
        title="Give"
        subtitle="Supporting the mission of Trinity Chapel Thika"
        crumbs={[{ label: 'Give' }]}
      />

      {/* Scripture hero */}
      <div className="bg-[#1C3A2E] py-14 text-center px-6">
        <div className="gold-rule mx-auto mb-6" style={{ width: '3rem', height: '2px', background: '#C9A845' }} />
        <blockquote className="font-serif text-2xl md:text-3xl text-white max-w-2xl mx-auto leading-relaxed">
          &ldquo;Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion,
          for God loves a cheerful giver.&rdquo;
        </blockquote>
        <cite className="mt-5 block text-sm text-[#C9A845] not-italic tracking-widest uppercase">
          2 Corinthians 9:7
        </cite>
      </div>

      <Section className="bg-[#FAFAF7]">
        {/* Intro */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <h2 className="font-serif text-3xl md:text-4xl text-[#1C3A2E] mb-4">
            Your Generosity Changes Lives
          </h2>
          <p className="text-[#6B7280] leading-relaxed">
            Every gift — tithe, offering, or special contribution — directly fuels the mission of Trinity Chapel
            Thika: reaching Thika and beyond with the Gospel, discipling the next generation, and serving our
            community. Thank you for partnering with us.
          </p>
        </div>

        {/* Giving Methods */}
        <div className="grid gap-6 md:grid-cols-3 mb-16">
          {/* M-Pesa */}
          <GivingCard
            icon={<Smartphone size={28} strokeWidth={1.5} />}
            title="M-Pesa"
            color="#1C3A2E"
          >
            <div className="space-y-3 text-sm">
              <GivingRow label="Paybill Number" value={site.giving?.mpesa?.paybill ?? '123456'} />
              <GivingRow label="Account Number" value={site.giving?.mpesa?.account ?? 'TITHE'} />
              <p className="text-[#6B7280] text-xs leading-relaxed pt-2 border-t border-[#EAE2D6]">
                Go to M-Pesa &rarr; Lipa na M-Pesa &rarr; Pay Bill, enter the numbers above.
              </p>
            </div>
          </GivingCard>

          {/* Bank Transfer */}
          <GivingCard
            icon={<Building2 size={28} strokeWidth={1.5} />}
            title="Bank Transfer"
            color="#2D6A4F"
          >
            <div className="space-y-3 text-sm">
              <GivingRow label="Bank" value={site.giving?.bank?.name ?? 'Equity Bank'} />
              <GivingRow label="Account Name" value={site.giving?.bank?.accountName ?? 'Trinity Chapel Thika'} />
              <GivingRow label="Account Number" value={site.giving?.bank?.accountNumber ?? '0123456789'} />
              <GivingRow label="Branch" value={site.giving?.bank?.branch ?? 'Thika'} />
            </div>
          </GivingCard>

          {/* In Person / Envelope */}
          <GivingCard
            icon={<Heart size={28} strokeWidth={1.5} />}
            title="In Person"
            color="#C9A845"
            textColor="#1C3A2E"
          >
            <p className="text-sm text-[#6B7280] leading-relaxed mb-4">
              You are also welcome to give during any of our Sunday services or mid-week gatherings.
              Envelopes are available at the welcome desk.
            </p>
            <div className="text-sm">
              <div className="font-medium text-[#1A1A1A] mb-1">Sunday Services</div>
              {site.services
                .filter((s: { day: string }) => s.day.toLowerCase().includes('sunday'))
                .map((s: { name: string; time: string; day: string }) => (
                  <div key={s.name} className="text-[#6B7280] text-xs">
                    {s.name} &mdash; {s.time}
                  </div>
                ))}
            </div>
          </GivingCard>
        </div>

        {/* Questions CTA */}
        <div
          className="rounded-2xl px-8 py-10 text-center max-w-xl mx-auto"
          style={{ background: '#F4EFE8', border: '1px solid #EAE2D6' }}
        >
          <Mail size={28} strokeWidth={1.5} className="mx-auto mb-3 text-[#C9A845]" />
          <h3 className="font-serif text-2xl text-[#1C3A2E] mb-2">Have Questions?</h3>
          <p className="text-sm text-[#6B7280] leading-relaxed mb-6">
            If you have any questions about giving, stewardship, or our church finances, please do not
            hesitate to reach out. We are happy to assist.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white bg-[#1C3A2E] hover:bg-[#2D6A4F] transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </Section>
    </>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function GivingCard({
  icon,
  title,
  color,
  textColor = 'white',
  children,
}: {
  icon: React.ReactNode
  title: string
  color: string
  textColor?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-[#EAE2D6] bg-white overflow-hidden flex flex-col">
      <div className="flex items-center gap-3 px-6 py-5" style={{ background: color, color: textColor }}>
        <span style={{ color: textColor === 'white' ? '#C9A845' : color === '#C9A845' ? '#1C3A2E' : '#C9A845' }}>
          {icon}
        </span>
        <h3 className="font-serif text-xl" style={{ color: textColor }}>
          {title}
        </h3>
      </div>
      <div className="px-6 py-5 flex-1">{children}</div>
    </div>
  )
}

function GivingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[#6B7280] text-xs uppercase tracking-wide">{label}</span>
      <span className="font-semibold text-[#1A1A1A] font-mono">{value}</span>
    </div>
  )
}
