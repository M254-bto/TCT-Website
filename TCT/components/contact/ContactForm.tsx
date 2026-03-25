'use client'

import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    // Build mailto link — no backend required
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)
    const subject = encodeURIComponent(form.subject || 'Message from website')
    window.location.href = `mailto:info@tckilifi.org?subject=${subject}&body=${body}`
    setTimeout(() => setStatus('sent'), 800)
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle size={48} className="text-[#2D6A4F] mb-4" strokeWidth={1.5} />
        <h3 className="font-serif text-2xl text-[#1C3A2E] mb-2">Thank you!</h3>
        <p className="text-[#6B7280] max-w-sm">
          Your message has been prepared. Your email client should have opened — please send to complete delivery.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm text-[#2D6A4F] underline underline-offset-2 hover:text-[#1C3A2E] transition-colors"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-1.5">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="John Kamau"
            className="w-full rounded-xl border border-[#EAE2D6] bg-white px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#6B7280]/50 outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10 transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full rounded-xl border border-[#EAE2D6] bg-white px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#6B7280]/50 outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10 transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-1.5">
          Subject
        </label>
        <select
          name="subject"
          value={form.subject}
          onChange={handleChange}
          className="w-full rounded-xl border border-[#EAE2D6] bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10 transition"
        >
          <option value="">Select a topic…</option>
          <option value="General Enquiry">General Enquiry</option>
          <option value="Prayer Request">Prayer Request</option>
          <option value="Events & Programmes">Events &amp; Programmes</option>
          <option value="Giving & Tithing">Giving &amp; Tithing</option>
          <option value="Pastoral Care">Pastoral Care</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-1.5">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          required
          rows={6}
          value={form.message}
          onChange={handleChange}
          placeholder="How can we help you?"
          className="w-full rounded-xl border border-[#EAE2D6] bg-white px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#6B7280]/50 outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10 transition resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white bg-[#1C3A2E] hover:bg-[#2D6A4F] disabled:opacity-60 transition-colors"
      >
        <Send size={15} />
        {status === 'sending' ? 'Preparing…' : 'Send Message'}
      </button>
    </form>
  )
}
