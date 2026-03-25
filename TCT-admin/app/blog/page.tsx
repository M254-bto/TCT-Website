'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Drawer } from '@/components/Drawer'
import { useToast } from '@/components/Toast'
import { slugify } from '@/lib/utils'

interface BlogPost {
  slug: string
  title: string
  author?: string
  date?: string
  category?: string
  excerpt?: string
  coverImage?: string
  content: string
}

const EMPTY: BlogPost = {
  slug: '',
  title: '',
  author: '',
  date: '',
  category: '',
  excerpt: '',
  coverImage: '',
  content: '',
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

const categories = ['Sermon Notes', 'Devotional', 'Announcement', 'Mission', 'Community', 'Teaching', 'Other']

function BlogForm({
  form,
  onChange,
  slugLocked,
  onSlugLock,
}: {
  form: BlogPost
  onChange: (f: BlogPost) => void
  slugLocked: boolean
  onSlugLock: () => void
}) {
  const set =
    (key: keyof BlogPost) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      onChange({ ...form, [key]: e.target.value })

  return (
    <div className="space-y-4">
      <Field label="Title *">
        <input
          type="text"
          value={form.title ?? ''}
          onChange={(e) => {
            const title = e.target.value
            onChange({ ...form, title, slug: slugLocked ? form.slug : slugify(title) })
          }}
          className={cls}
          required
          placeholder="Post title"
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
        <Field label="Author">
          <input type="text" value={form.author ?? ''} onChange={set('author')} className={cls} placeholder="Pastor Name" />
        </Field>
        <Field label="Date">
          <input type="date" value={form.date ?? ''} onChange={set('date')} className={cls} />
        </Field>
      </div>

      <Field label="Category">
        <select value={form.category ?? ''} onChange={set('category')} className={cls}>
          <option value="">Select…</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </Field>

      <Field label="Excerpt">
        <textarea value={form.excerpt ?? ''} onChange={set('excerpt')} rows={2} className={cls} placeholder="Short summary shown in listings" />
      </Field>

      <Field label="Cover Image URL">
        <input type="url" value={form.coverImage ?? ''} onChange={set('coverImage')} className={cls} placeholder="https://…/image.jpg" />
      </Field>

      <Field label="Content (Markdown)">
        <textarea
          value={form.content ?? ''}
          onChange={set('content')}
          rows={14}
          className={`${cls} font-mono text-xs leading-relaxed`}
          placeholder="Write your post in Markdown…"
        />
      </Field>
    </div>
  )
}

export default function BlogPage() {
  const [items, setItems] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [form, setForm] = useState<BlogPost>(EMPTY)
  const [slugLocked, setSlugLocked] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const { toast } = useToast()

  const load = async () => {
    try {
      const res = await fetch('/api/blog')
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

  const openEdit = async (item: BlogPost) => {
    // Fetch full post (with content) for editing
    const res = await fetch(`/api/blog/${item.slug}`)
    const full = res.ok ? await res.json() : item
    setEditing(full)
    setForm({ ...full })
    setSlugLocked(true)
    setDrawerOpen(true)
  }

  const handleSave = async () => {
    if (!form.title?.trim()) {
      toast({ type: 'error', message: 'Title is required' })
      return
    }
    setSaving(true)
    const payload = { ...form, slug: form.slug || slugify(form.title) }
    const res = editing
      ? await fetch(`/api/blog/${editing.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      : await fetch('/api/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
    setSaving(false)
    if (res.ok) {
      toast({ type: 'success', message: editing ? 'Post updated' : 'Post created' })
      setDrawerOpen(false)
      load()
    } else {
      toast({ type: 'error', message: 'Failed to save post' })
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const res = await fetch(`/api/blog/${deleteTarget}`, { method: 'DELETE' })
    if (res.ok) {
      toast({ type: 'success', message: 'Post deleted' })
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
          <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
          <p className="text-sm text-gray-500 mt-0.5">{items.length} posts</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#1C3A2E] text-white rounded-lg text-sm font-medium hover:bg-[#2a5240] transition-colors"
        >
          <Plus size={16} /> New Post
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-gray-200 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden md:table-cell">Author</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden lg:table-cell">Date</th>
                <th className="w-20 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item) => (
                <tr key={item.slug} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-[220px] truncate">{item.title}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{item.author}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {item.category && (
                      <span className="text-xs px-2 py-0.5 bg-[#C9A845]/15 text-[#8B6E1A] rounded-full font-medium">
                        {item.category}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden lg:table-cell text-xs">{item.date}</td>
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
                    No blog posts yet. Click &ldquo;New Post&rdquo; to write the first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title={editing ? 'Edit Post' : 'New Post'} onSave={handleSave} isSaving={saving}>
        <BlogForm form={form} onChange={setForm} slugLocked={slugLocked} onSlugLock={() => setSlugLocked(true)} />
      </Drawer>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-semibold text-gray-900 mb-1">Delete Post?</h3>
            <p className="text-sm text-gray-500 mb-5">The markdown file will be permanently deleted.</p>
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
