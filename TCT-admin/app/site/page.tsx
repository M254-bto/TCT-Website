'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Save } from 'lucide-react'
import { useToast } from '@/components/Toast'

// ─── Types ─────────────────────────────────────────────────────────────────

interface SiteConfig {
  name?: string
  shortName?: string
  tagline?: string
  subTagline?: string
  scripture?: string
  scriptureRef?: string
  mission?: string
  vision?: string
  communityStatement?: string
  address?: {
    street?: string
    area?: string
    city?: string
    country?: string
    full?: string
  }
  contact?: {
    phone?: string
    email?: string
  }
  mapUrl?: string
  mapEmbed?: string
  giving?: {
    mpesa?: string
    bank?: string
  }
  socials?: {
    facebook?: string
    twitter?: string
    instagram?: string
    youtube?: string
  }
  services?: Array<{ day?: string; time?: string; name?: string }>
  deep?: Array<{ title?: string; description?: string }>
  wide?: Array<{ title?: string; description?: string }>
  leadership?: Array<{ name?: string; role?: string; image?: string }>
}

// ─── Shared UI ─────────────────────────────────────────────────────────────

const cls =
  'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3A2E]/20 focus:border-[#1C3A2E] transition-colors'
const labelCls = 'block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1'

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h2 className="text-base font-semibold text-gray-900 pb-3 border-b border-gray-100">{title}</h2>
      {children}
    </div>
  )
}

// ─── Repeater components ───────────────────────────────────────────────────

function ServicesRepeater({
  items,
  onChange,
}: {
  items: SiteConfig['services']
  onChange: (v: SiteConfig['services']) => void
}) {
  const list = items ?? []
  const set = (i: number, key: string, val: string) => {
    const next = list.map((item, idx) => (idx === i ? { ...item, [key]: val } : item))
    onChange(next)
  }
  return (
    <div className="space-y-3">
      {list.map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="grid grid-cols-3 gap-2 flex-1">
            <input type="text" value={item.day ?? ''} onChange={(e) => set(i, 'day', e.target.value)} className={cls} placeholder="Sunday" />
            <input type="text" value={item.time ?? ''} onChange={(e) => set(i, 'time', e.target.value)} className={cls} placeholder="9:00 AM" />
            <input type="text" value={item.name ?? ''} onChange={(e) => set(i, 'name', e.target.value)} className={cls} placeholder="Morning Service" />
          </div>
          <button onClick={() => onChange(list.filter((_, idx) => idx !== i))} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors mt-0.5">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <div className="grid grid-cols-3 gap-2 text-[10px] text-gray-400 px-0.5">
        <span>Day</span><span>Time</span><span>Service Name</span>
      </div>
      <button
        onClick={() => onChange([...list, { day: '', time: '', name: '' }])}
        className="flex items-center gap-2 text-xs font-medium text-[#1C3A2E] hover:text-[#2a5240] transition-colors"
      >
        <Plus size={14} /> Add Service
      </button>
    </div>
  )
}

function DeepWideRepeater({
  items,
  onChange,
}: {
  items: Array<{ title?: string; description?: string }> | undefined
  onChange: (v: Array<{ title?: string; description?: string }>) => void
}) {
  const list = items ?? []
  const set = (i: number, key: string, val: string) =>
    onChange(list.map((item, idx) => (idx === i ? { ...item, [key]: val } : item)))
  return (
    <div className="space-y-3">
      {list.map((item, i) => (
        <div key={i} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg">
          <div className="flex-1 space-y-2">
            <input type="text" value={item.title ?? ''} onChange={(e) => set(i, 'title', e.target.value)} className={cls} placeholder="Title" />
            <textarea value={item.description ?? ''} onChange={(e) => set(i, 'description', e.target.value)} rows={2} className={cls} placeholder="Description" />
          </div>
          <button onClick={() => onChange(list.filter((_, idx) => idx !== i))} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...list, { title: '', description: '' }])}
        className="flex items-center gap-2 text-xs font-medium text-[#1C3A2E] hover:text-[#2a5240] transition-colors"
      >
        <Plus size={14} /> Add Item
      </button>
    </div>
  )
}

function LeadershipRepeater({
  items,
  onChange,
}: {
  items: SiteConfig['leadership']
  onChange: (v: SiteConfig['leadership']) => void
}) {
  const list = items ?? []
  const set = (i: number, key: string, val: string) =>
    onChange(list.map((item, idx) => (idx === i ? { ...item, [key]: val } : item)))
  return (
    <div className="space-y-3">
      {list.map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="grid grid-cols-3 gap-2 flex-1">
            <input type="text" value={item.name ?? ''} onChange={(e) => set(i, 'name', e.target.value)} className={cls} placeholder="Full Name" />
            <input type="text" value={item.role ?? ''} onChange={(e) => set(i, 'role', e.target.value)} className={cls} placeholder="Role / Title" />
            <input type="url" value={item.image ?? ''} onChange={(e) => set(i, 'image', e.target.value)} className={cls} placeholder="Photo URL" />
          </div>
          <button onClick={() => onChange(list.filter((_, idx) => idx !== i))} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors mt-0.5">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <div className="grid grid-cols-3 gap-2 text-[10px] text-gray-400 px-0.5">
        <span>Name</span><span>Role</span><span>Photo URL</span>
      </div>
      <button
        onClick={() => onChange([...list, { name: '', role: '', image: '' }])}
        className="flex items-center gap-2 text-xs font-medium text-[#1C3A2E] hover:text-[#2a5240] transition-colors"
      >
        <Plus size={14} /> Add Leader
      </button>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function SiteConfigPage() {
  const [config, setConfig] = useState<SiteConfig>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetch('/api/site')
      .then((r) => r.json())
      .then((data) => setConfig(data))
      .catch(() => toast({ type: 'error', message: 'Failed to load site config' }))
      .finally(() => setLoading(false))
  }, [])

  const update = (patch: Partial<SiteConfig>) => setConfig((c) => ({ ...c, ...patch }))
  const updateNested = <K extends keyof SiteConfig>(key: K, patch: Partial<SiteConfig[K] & object>) =>
    setConfig((c) => ({ ...c, [key]: { ...(c[key] as object), ...patch } }))

  const handleSave = async () => {
    setSaving(true)
    const res = await fetch('/api/site', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    })
    setSaving(false)
    if (res.ok) {
      toast({ type: 'success', message: 'Site config saved' })
    } else {
      toast({ type: 'error', message: 'Failed to save config' })
    }
  }

  const inp = (key: keyof SiteConfig) => ({
    value: (config[key] as string) ?? '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      update({ [key]: e.target.value }),
    className: cls,
  })

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-40 bg-gray-200 rounded-xl animate-pulse" />)}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Config</h1>
          <p className="text-sm text-gray-500 mt-0.5">Global settings for Trinity Chapel Thika</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-[#1C3A2E] text-white rounded-lg text-sm font-medium hover:bg-[#2a5240] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-5">
        {/* Basic Info */}
        <Section title="Basic Information">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Church Name"><input {...inp('name')} placeholder="Trinity Chapel Thika" /></Field>
            <Field label="Short Name"><input {...inp('shortName')} placeholder="TCT" /></Field>
          </div>
          <Field label="Tagline"><input {...inp('tagline')} placeholder="Main tagline" /></Field>
          <Field label="Sub-Tagline"><input {...inp('subTagline')} placeholder="Sub-tagline" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Scripture Quote">
              <input {...inp('scripture')} placeholder="For God so loved…" />
            </Field>
            <Field label="Scripture Reference">
              <input {...inp('scriptureRef')} placeholder="John 3:16" />
            </Field>
          </div>
        </Section>

        {/* Mission & Vision */}
        <Section title="Mission, Vision & Values">
          <Field label="Mission">
            <textarea
              value={config.mission ?? ''}
              onChange={(e) => update({ mission: e.target.value })}
              rows={3}
              className={cls}
              placeholder="Our mission statement…"
            />
          </Field>
          <Field label="Vision">
            <textarea
              value={config.vision ?? ''}
              onChange={(e) => update({ vision: e.target.value })}
              rows={3}
              className={cls}
              placeholder="Our vision…"
            />
          </Field>
          <Field label="Community Statement">
            <textarea
              value={config.communityStatement ?? ''}
              onChange={(e) => update({ communityStatement: e.target.value })}
              rows={2}
              className={cls}
              placeholder="Community statement…"
            />
          </Field>
        </Section>

        {/* Contact & Address */}
        <Section title="Contact & Address">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone">
              <input
                value={config.contact?.phone ?? ''}
                onChange={(e) => updateNested('contact', { phone: e.target.value })}
                className={cls}
                placeholder="+254 700 000 000"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={config.contact?.email ?? ''}
                onChange={(e) => updateNested('contact', { email: e.target.value })}
                className={cls}
                placeholder="info@example.com"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Street">
              <input value={config.address?.street ?? ''} onChange={(e) => updateNested('address', { street: e.target.value })} className={cls} placeholder="123 Church Rd" />
            </Field>
            <Field label="Area">
              <input value={config.address?.area ?? ''} onChange={(e) => updateNested('address', { area: e.target.value })} className={cls} placeholder="Area name" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="City">
              <input value={config.address?.city ?? ''} onChange={(e) => updateNested('address', { city: e.target.value })} className={cls} placeholder="Thika" />
            </Field>
            <Field label="Country">
              <input value={config.address?.country ?? ''} onChange={(e) => updateNested('address', { country: e.target.value })} className={cls} placeholder="Kenya" />
            </Field>
          </div>
          <Field label="Full Address (used in footer)">
            <input value={config.address?.full ?? ''} onChange={(e) => updateNested('address', { full: e.target.value })} className={cls} placeholder="Full address string" />
          </Field>
          <Field label="Google Maps URL">
            <input type="url" {...inp('mapUrl')} placeholder="https://maps.google.com/…" />
          </Field>
          <Field label="Google Maps Embed URL">
            <input type="url" {...inp('mapEmbed')} placeholder="https://www.google.com/maps/embed?…" />
          </Field>
        </Section>

        {/* Giving */}
        <Section title="Giving / Offering">
          <Field label="M-Pesa Details">
            <textarea
              value={config.giving?.mpesa ?? ''}
              onChange={(e) => updateNested('giving', { mpesa: e.target.value })}
              rows={3}
              className={cls}
              placeholder="Paybill: 123456&#10;Account: TRIN"
            />
          </Field>
          <Field label="Bank Details">
            <textarea
              value={config.giving?.bank ?? ''}
              onChange={(e) => updateNested('giving', { bank: e.target.value })}
              rows={3}
              className={cls}
              placeholder="Bank: KCB&#10;Branch: Thika&#10;Account: …"
            />
          </Field>
        </Section>

        {/* Socials */}
        <Section title="Social Media">
          <div className="grid grid-cols-2 gap-4">
            {(['facebook', 'twitter', 'instagram', 'youtube'] as const).map((platform) => (
              <Field key={platform} label={platform.charAt(0).toUpperCase() + platform.slice(1)}>
                <input
                  type="url"
                  value={config.socials?.[platform] ?? ''}
                  onChange={(e) => updateNested('socials', { [platform]: e.target.value })}
                  className={cls}
                  placeholder={`https://${platform}.com/…`}
                />
              </Field>
            ))}
          </div>
        </Section>

        {/* Services */}
        <Section title="Service Times">
          <ServicesRepeater
            items={config.services}
            onChange={(v) => update({ services: v })}
          />
        </Section>

        {/* DEEP */}
        <Section title="DEEP Framework">
          <p className="text-xs text-gray-400 -mt-2">Discipleship pillars (D-E-E-P)</p>
          <DeepWideRepeater items={config.deep} onChange={(v) => update({ deep: v })} />
        </Section>

        {/* WIDE */}
        <Section title="WIDE Framework">
          <p className="text-xs text-gray-400 -mt-2">Outreach pillars (W-I-D-E)</p>
          <DeepWideRepeater items={config.wide} onChange={(v) => update({ wide: v })} />
        </Section>

        {/* Leadership */}
        <Section title="Leadership Team">
          <LeadershipRepeater
            items={config.leadership}
            onChange={(v) => update({ leadership: v })}
          />
        </Section>
      </div>

      {/* Floating save bar */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#1C3A2E] text-white rounded-lg text-sm font-medium hover:bg-[#2a5240] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
        >
          <Save size={16} />
          {saving ? 'Saving…' : 'Save All Changes'}
        </button>
      </div>
    </div>
  )
}
