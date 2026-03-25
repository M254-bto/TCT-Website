'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Drawer } from '@/components/Drawer'
import { useToast } from '@/components/Toast'
import { slugify } from '@/lib/utils'

interface Ministry {
  slug: string
  name: string
  tagline?: string
  description?: string
  icon?: string
  lead?: string
  meetingTime?: string
  coverImage?: string
}

const EMPTY: Ministry = {
  slug: '',
  name: '',
  tagline: '',
  description: '',
  icon: '',
  lead: '',
  meetingTime: '',
  coverImage: '',
}

const cls =
  'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3A2E]/20 focus:border-[#1C3A2E] transition-colors'
const labelCls = 'block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  )
}

function MinistryForm({
  form,
  onChange,
  slugLocked,
  onSlugLock,
}: {
  form: Ministry
  onChange: (f: Ministry) => void
  slugLocked: boolean
  onSlugLock: () => void
}) {
  const set =
    (key: keyof Ministry) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange({ ...form, [key]: e.target.value })

  return (
    <div className="space-y-4">
      <Field label="Name *">
        <input
          type="text"
          value={form.name ?? ''}
          onChange={(e) => {
            const name = e.target.value
            onChange({ ...form, name, slug: slugLocked ? form.slug : slugify(name) })
          }}
          className={cls}
          required
          placeholder="Ministry name"
        />
      </Field>

      <Field label="Slug (auto-generated)">
        <input
          type="text"
          value={form.slug ?? ''}
          onChange={(e) => {
            onSlugLock()
            onChange({ ...form, slug: e.target.value })
          }}
          className={cls}
          placeholder="auto"
        />
      </Field>

      <Field label="Tagline">
        <input type="text" value={form.tagline ?? ''} onChange={set('tagline')} className={cls} placeholder="Short tagline" />
      </Field>

      <Field label="Description">
        <textarea value={form.description ?? ''} onChange={set('description')} rows={4} className={cls} placeholder="Describe this ministry…" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Leader">
          <input type="text" value={form.lead ?? ''} onChange={set('lead')} className={cls} placeholder="Leader name" />
        </Field>
        <Field label="Meeting Time">
          <input type="text" value={form.meetingTime ?? ''} onChange={set('meetingTime')} className={cls} placeholder="Sundays 2pm" />
        </Field>
      </div>

      <Field label="Icon (emoji or name)">
        <input type="text" value={form.icon ?? ''} onChange={set('icon')} className={cls} placeholder="🎵 or HeartHandshake" />
      </Field>

      <Field label="Cover Image URL">
        <input type="url" value={form.coverImage ?? ''} onChange={set('coverImage')} className={cls} placeholder="https://…/image.jpg" />
      </Field>
    </div>
  )
}

export default function MinistriesPage() {
  const [items, setItems] = useState<Ministry[]>([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<Ministry | null>(null)
  const [form, setForm] = useState<Ministry>(EMPTY)
  const [slugLocked, setSlugLocked] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const { toast } = useToast()

  const load = async () => {
    try {
      const res = await fetch('/api/content/ministries')
      if (res.ok) setItems(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY)
    setSlugLocked(false)
    setDrawerOpen(true)
  }

  const openEdit = (item: Ministry) => {
    setEditing(item)
    setForm({ ...item })
    setSlugLocked(true)
    setDrawerOpen(true)
  }

  const handleSave = async () => {
    if (!form.name?.trim()) {
      toast({ type: 'error', message: 'Name is required' })
      return
    }
    setSaving(true)
    const payload = { ...form, slug: form.slug || slugify(form.name) }
    const res = editing
      ? await fetch(`/api/content/ministries/${editing.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      : await fetch('/api/content/ministries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
    setSaving(false)
    if (res.ok) {
      toast({ type: 'success', message: editing ? 'Ministry updated' : 'Ministry added' })
      setDrawerOpen(false)
      load()
    } else {
      toast({ type: 'error', message: 'Failed to save ministry' })
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const res = await fetch(`/api/content/ministries/${deleteTarget}`, { method: 'DELETE' })
    if (res.ok) {
      toast({ type: 'success', message: 'Ministry deleted' })
      setDeleteTarget(null)
      load()
    } else {
      toast({ type: 'error', message: 'Failed to delete' })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ministries</h1>
          <p className="text-sm text-gray-500 mt-0.5">{items.length} total</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#1C3A2E] text-white rounded-lg text-sm font-medium hover:bg-[#2a5240] transition-colors"
        >
          <Plus size={16} /> New Ministry
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-gray-200 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden md:table-cell">Leader</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden lg:table-cell">Meeting Time</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden lg:table-cell">Tagline</th>
                <th className="w-20 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item) => (
                <tr key={item.slug} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{item.lead}</td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell text-xs">{item.meetingTime}</td>
                  <td className="px-4 py-3 text-gray-400 hidden lg:table-cell text-xs truncate max-w-[180px]">{item.tagline}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-[#1C3A2E] hover:bg-gray-100 rounded transition-colors" title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteTarget(item.slug)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No ministries yet. Click &ldquo;New Ministry&rdquo; to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title={editing ? 'Edit Ministry' : 'New Ministry'} onSave={handleSave} isSaving={saving}>
        <MinistryForm form={form} onChange={setForm} slugLocked={slugLocked} onSlugLock={() => setSlugLocked(true)} />
      </Drawer>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-semibold text-gray-900 mb-1">Delete Ministry?</h3>
            <p className="text-sm text-gray-500 mb-5">This cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
