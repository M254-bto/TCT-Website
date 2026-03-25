'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Drawer } from '@/components/Drawer'
import { useToast } from '@/components/Toast'
import { slugify } from '@/lib/utils'

interface Sermon {
  slug: string
  title: string
  preacher?: string
  date?: string
  series?: string
  scripture?: string
  tags?: string[] | string
  excerpt?: string
  audioUrl?: string
  videoUrl?: string
  coverImage?: string
}

const EMPTY: Sermon = {
  slug: '',
  title: '',
  preacher: '',
  date: '',
  series: '',
  scripture: '',
  tags: '',
  excerpt: '',
  audioUrl: '',
  videoUrl: '',
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

function SermonForm({
  form,
  onChange,
  slugLocked,
  onSlugLock,
}: {
  form: Sermon
  onChange: (f: Sermon) => void
  slugLocked: boolean
  onSlugLock: () => void
}) {
  const set = (key: keyof Sermon) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ ...form, [key]: e.target.value })

  return (
    <div className="space-y-4">
      <Field label="Title *">
        <input
          type="text"
          value={form.title ?? ''}
          onChange={(e) => {
            const title = e.target.value
            onChange({
              ...form,
              title,
              slug: slugLocked ? form.slug : slugify(title),
            })
          }}
          className={cls}
          required
          placeholder="e.g. Walking by Faith"
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

      <div className="grid grid-cols-2 gap-4">
        <Field label="Preacher">
          <input type="text" value={form.preacher ?? ''} onChange={set('preacher')} className={cls} placeholder="Pastor Name" />
        </Field>
        <Field label="Date">
          <input type="date" value={form.date ?? ''} onChange={set('date')} className={cls} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Series">
          <input type="text" value={form.series ?? ''} onChange={set('series')} className={cls} placeholder="Series name" />
        </Field>
        <Field label="Scripture">
          <input type="text" value={form.scripture ?? ''} onChange={set('scripture')} className={cls} placeholder="e.g. John 3:16" />
        </Field>
      </div>

      <Field label="Tags (comma-separated)">
        <input type="text" value={Array.isArray(form.tags) ? form.tags.join(', ') : (form.tags ?? '')} onChange={set('tags')} className={cls} placeholder="faith, grace, prayer" />
      </Field>

      <Field label="Excerpt">
        <textarea value={form.excerpt ?? ''} onChange={set('excerpt')} rows={3} className={cls} placeholder="Brief summary…" />
      </Field>

      <Field label="Audio URL">
        <input type="url" value={form.audioUrl ?? ''} onChange={set('audioUrl')} className={cls} placeholder="https://…" />
      </Field>

      <Field label="Video URL">
        <input type="url" value={form.videoUrl ?? ''} onChange={set('videoUrl')} className={cls} placeholder="https://youtube.com/…" />
      </Field>

      <Field label="Cover Image URL">
        <input type="url" value={form.coverImage ?? ''} onChange={set('coverImage')} className={cls} placeholder="https://…/image.jpg" />
      </Field>
    </div>
  )
}

export default function SermonsPage() {
  const [items, setItems] = useState<Sermon[]>([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<Sermon | null>(null)
  const [form, setForm] = useState<Sermon>(EMPTY)
  const [slugLocked, setSlugLocked] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const { toast } = useToast()

  const load = async () => {
    try {
      const res = await fetch('/api/content/sermons')
      if (res.ok) setItems(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY)
    setSlugLocked(false)
    setDrawerOpen(true)
  }

  const openEdit = (item: Sermon) => {
    setEditing(item)
    setForm({
      ...item,
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags ?? ''),
    })
    setSlugLocked(true)
    setDrawerOpen(true)
  }

  const handleSave = async () => {
    if (!form.title?.trim()) {
      toast({ type: 'error', message: 'Title is required' })
      return
    }
    setSaving(true)
    const payload: Sermon = {
      ...form,
      slug: form.slug || slugify(form.title),
      tags:
        typeof form.tags === 'string'
          ? form.tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : form.tags,
    }
    const res = editing
      ? await fetch(`/api/content/sermons/${editing.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      : await fetch('/api/content/sermons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
    setSaving(false)
    if (res.ok) {
      toast({ type: 'success', message: editing ? 'Sermon updated' : 'Sermon added' })
      setDrawerOpen(false)
      load()
    } else {
      toast({ type: 'error', message: 'Failed to save sermon' })
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const res = await fetch(`/api/content/sermons/${deleteTarget}`, { method: 'DELETE' })
    if (res.ok) {
      toast({ type: 'success', message: 'Sermon deleted' })
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
          <h1 className="text-2xl font-bold text-gray-900">Sermons</h1>
          <p className="text-sm text-gray-500 mt-0.5">{items.length} total</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#1C3A2E] text-white rounded-lg text-sm font-medium hover:bg-[#2a5240] transition-colors"
        >
          <Plus size={16} /> New Sermon
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden md:table-cell">Preacher</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden lg:table-cell">Series</th>
                <th className="w-20 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item) => (
                <tr key={item.slug} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-[220px] truncate">{item.title}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{item.preacher}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{item.date}</td>
                  <td className="px-4 py-3 text-gray-400 hidden lg:table-cell text-xs">{item.series}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(item)}
                        className="p-1.5 text-gray-400 hover:text-[#1C3A2E] hover:bg-gray-100 rounded transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item.slug)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No sermons yet. Click &ldquo;New Sermon&rdquo; to add the first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Edit Sermon' : 'New Sermon'}
        onSave={handleSave}
        isSaving={saving}
      >
        <SermonForm
          form={form}
          onChange={setForm}
          slugLocked={slugLocked}
          onSlugLock={() => setSlugLocked(true)}
        />
      </Drawer>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-semibold text-gray-900 mb-1">Delete Sermon?</h3>
            <p className="text-sm text-gray-500 mb-5">This cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
