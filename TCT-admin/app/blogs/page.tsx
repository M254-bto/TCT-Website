'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, FileText } from 'lucide-react'
import { Drawer } from '@/components/Drawer'
import { useToast } from '@/components/Toast'
import { slugify } from '@/lib/utils'

interface BlogPost {
  slug: string
  title: string
  date: string
  category: string
  author: string
  excerpt: string
  coverImage: string
  content?: string
}

const EMPTY: BlogPost = {
  slug: '',
  title: '',
  date: '',
  category: '',
  author: '',
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
  const set = (key: keyof BlogPost) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
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
          placeholder="e.g. The Power of Grace"
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
          <input type="text" value={form.author ?? ''} onChange={set('author')} className={cls} placeholder="Author name" />
        </Field>
        <Field label="Date">
          <input type="date" value={form.date ?? ''} onChange={set('date')} className={cls} />
        </Field>
      </div>

      <Field label="Category">
        <input type="text" value={form.category ?? ''} onChange={set('category')} className={cls} placeholder="e.g. Christian Living, Theology" />
      </Field>

      <Field label="Excerpt (Brief Summary)">
        <textarea value={form.excerpt ?? ''} onChange={set('excerpt')} rows={2} className={cls} placeholder="A short introduction to the post..." />
      </Field>

      <Field label="Cover Image URL">
        <input type="url" value={form.coverImage ?? ''} onChange={set('coverImage')} className={cls} placeholder="https://.../image.jpg" />
      </Field>

      <Field label="Markdown Content Body *">
        <textarea
          value={form.content ?? ''}
          onChange={set('content')}
          rows={12}
          className={`${cls} font-mono text-xs`}
          placeholder="# Heading&#10;&#10;Write your post body here in markdown format..."
          required
        />
      </Field>
    </div>
  )
}

export default function BlogsPage() {
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
      const res = await fetch('/api/content/blogs')
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
    setForm({
      ...EMPTY,
      date: new Date().toISOString().split('T')[0],
      author: 'Trinity Chapel Thika',
    })
    setSlugLocked(false)
    setDrawerOpen(true)
  }

  const openEdit = async (item: BlogPost) => {
    setSaving(true)
    try {
      // Fetch full post detail with content markdown body
      const res = await fetch(`/api/content/blogs/${item.slug}`)
      if (res.ok) {
        const detail = await res.json()
        setEditing(detail)
        setForm(detail)
        setSlugLocked(true)
        setDrawerOpen(true)
      } else {
        toast({ type: 'error', message: 'Failed to load post detail' })
      }
    } finally {
      setSaving(false)
    }
  }

  const handleSave = async () => {
    if (!form.title?.trim()) {
      toast({ type: 'error', message: 'Title is required' })
      return
    }
    setSaving(true)
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
    }
    const res = editing
      ? await fetch(`/api/content/blogs/${editing.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      : await fetch('/api/content/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
    setSaving(false)
    if (res.ok) {
      toast({ type: 'success', message: editing ? 'Blog post updated' : 'Blog post added' })
      setDrawerOpen(false)
      load()
    } else {
      toast({ type: 'error', message: 'Failed to save blog post' })
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const res = await fetch(`/api/content/blogs/${deleteTarget}`, { method: 'DELETE' })
    if (res.ok) {
      toast({ type: 'success', message: 'Blog post deleted' })
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
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-0.5">{items.length} total</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#1C3A2E] text-white rounded-lg text-sm font-medium hover:bg-[#2a5240] transition-colors"
        >
          <Plus size={16} /> New Blog Post
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
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden md:table-cell">Author</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden lg:table-cell">Category</th>
                <th className="w-20 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item) => (
                <tr key={item.slug} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-[250px] truncate">{item.title}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{item.author}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{item.date}</td>
                  <td className="px-4 py-3 text-gray-400 hidden lg:table-cell text-xs">{item.category}</td>
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
                    No blog posts yet. Click &ldquo;New Blog Post&rdquo; to add the first one.
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
        title={editing ? 'Edit Blog Post' : 'New Blog Post'}
        onSave={handleSave}
        isSaving={saving}
      >
        <BlogForm
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
            <h3 className="font-semibold text-gray-900 mb-1">Delete Blog Post?</h3>
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
