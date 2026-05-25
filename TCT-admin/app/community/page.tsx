'use client'

import { useEffect, useState, useRef } from 'react'
import { Plus, Pencil, Trash2, Upload, Loader2, Calendar as CalendarIcon, Image as ImageIcon } from 'lucide-react'
import { Drawer } from '@/components/Drawer'
import { useToast } from '@/components/Toast'
import { slugify } from '@/lib/utils'

interface CommunityPhoto {
  slug: string
  title: string
  image: string
  date: string
}

const EMPTY: CommunityPhoto = {
  slug: '',
  title: '',
  image: '',
  date: new Date().toISOString().split('T')[0],
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

function PhotoForm({
  form,
  onChange,
  slugLocked,
  onSlugLock,
}: {
  form: CommunityPhoto
  onChange: (f: CommunityPhoto) => void
  slugLocked: boolean
  onSlugLock: () => void
}) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      onChange({ ...form, image: data.url })
    } catch (err) {
      console.error(err)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    onChange({
      ...form,
      title,
      slug: slugLocked ? form.slug : slugify(title),
    })
  }

  return (
    <div className="space-y-4">
      {/* Image Upload Area */}
      <Field label="Photo *">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 hover:bg-gray-100/50 transition-colors">
          {form.image ? (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 shadow-sm max-h-48 flex items-center justify-center bg-gray-100">
              <img src={form.image} alt={form.title || 'Preview'} className="w-full h-full object-cover" />
              {uploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                  <Loader2 className="animate-spin" size={24} />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-gray-400">
              {uploading ? (
                <Loader2 className="animate-spin text-gray-500 mb-2" size={32} />
              ) : (
                <ImageIcon className="mb-2 text-gray-300" size={40} />
              )}
              <p className="text-xs text-gray-500 font-medium">No photo selected</p>
            </div>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Upload size={14} />
            {form.image ? 'Change Photo' : 'Upload Photo'}
          </button>
        </div>
      </Field>

      <Field label="Title / Caption *">
        <input
          type="text"
          value={form.title}
          onChange={handleTitleChange}
          className={cls}
          required
          placeholder="e.g. Easter Celebration 2026"
        />
      </Field>

      <Field label="Slug (auto-generated)">
        <input
          type="text"
          value={form.slug}
          onChange={(e) => {
            onSlugLock()
            onChange({ ...form, slug: e.target.value })
          }}
          className={cls}
          placeholder="auto"
        />
      </Field>

      <Field label="Date *">
        <input
          type="date"
          value={form.date}
          onChange={(e) => onChange({ ...form, date: e.target.value })}
          className={cls}
          required
        />
      </Field>
    </div>
  )
}

export default function CommunityPhotosPage() {
  const [items, setItems] = useState<CommunityPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<CommunityPhoto | null>(null)
  const [form, setForm] = useState<CommunityPhoto>(EMPTY)
  const [slugLocked, setSlugLocked] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const { toast } = useToast()

  const load = async () => {
    try {
      const res = await fetch('/api/content/community')
      if (res.ok) {
        const data = await res.json()
        setItems(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error(err)
      toast({ type: 'error', message: 'Failed to load community photos' })
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
    })
    setSlugLocked(false)
    setDrawerOpen(true)
  }

  const openEdit = (item: CommunityPhoto) => {
    setEditing(item)
    setForm({ ...item })
    setSlugLocked(true)
    setDrawerOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast({ type: 'error', message: 'Title is required' })
      return
    }
    if (!form.image.trim()) {
      toast({ type: 'error', message: 'Photo is required. Please upload one.' })
      return
    }
    
    setSaving(true)
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
    }

    const res = editing
      ? await fetch(`/api/content/community/${editing.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      : await fetch('/api/content/community', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        
    setSaving(false)
    if (res.ok) {
      toast({ type: 'success', message: editing ? 'Photo updated' : 'Photo added' })
      setDrawerOpen(false)
      load()
    } else {
      toast({ type: 'error', message: 'Failed to save community photo' })
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const res = await fetch(`/api/content/community/${deleteTarget}`, { method: 'DELETE' })
    if (res.ok) {
      toast({ type: 'success', message: 'Photo deleted' })
      setDeleteTarget(null)
      load()
    } else {
      toast({ type: 'error', message: 'Failed to delete photo' })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Community Photos</h1>
          <p className="text-sm text-gray-500 mt-0.5">{items.length} total photos in grid</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#1C3A2E] text-white rounded-lg text-sm font-medium hover:bg-[#2a5240] transition-colors"
        >
          <Plus size={16} /> Add Photo
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.slug} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#1C3A2E]/30 hover:shadow-md transition-all duration-200 flex flex-col">
              {/* Photo Area */}
              <div className="relative aspect-video w-full overflow-hidden bg-gray-100 border-b border-gray-100 flex items-center justify-center shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <ImageIcon className="text-gray-300" size={32} />
                )}
              </div>
              
              {/* Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2" title={item.title}>
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                    <CalendarIcon size={12} />
                    <span>{item.date}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t border-gray-50">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-1.5 text-gray-500 hover:text-[#1C3A2E] hover:bg-gray-100 rounded transition-colors"
                    title="Edit Details"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item.slug)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete Photo"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="col-span-full bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 text-sm">
              <ImageIcon className="mx-auto text-gray-300 mb-3" size={48} />
              No photos added yet. Click &ldquo;Add Photo&rdquo; to add your first photo to the community section.
            </div>
          )}
        </div>
      )}

      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Edit Photo Details' : 'Add Community Photo'}
        onSave={handleSave}
        isSaving={saving}
      >
        <PhotoForm
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
            <h3 className="font-semibold text-gray-900 mb-1">Delete Photo?</h3>
            <p className="text-sm text-gray-500 mb-5">This photo will be removed from the community section on the website.</p>
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
