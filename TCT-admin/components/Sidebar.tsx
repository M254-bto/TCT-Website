'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Users,
  FileText,
  Settings,
  Menu,
  X,
} from 'lucide-react'

const nav = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/sermons', label: 'Sermons', icon: BookOpen },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/ministries', label: 'Ministries', icon: Users },
  { href: '/blog', label: 'Blog', icon: FileText },
  { href: '/site', label: 'Site Config', icon: Settings },
]

function Brand() {
  return (
    <div className="px-6 py-5 border-b border-white/10">
      <p className="font-bold text-white text-base tracking-tight">Trinity Chapel</p>
      <p className="text-[#C9A845] text-[10px] tracking-[0.2em] uppercase mt-0.5">Admin Panel</p>
    </div>
  )
}

function NavLinks({ onNav }: { onNav?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-0.5 px-3 py-3">
      {nav.map(({ href, label, icon: Icon }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            onClick={onNav}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              active
                ? 'bg-[#C9A845]/20 text-[#C9A845]'
                : 'text-white/65 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon size={17} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

export function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* ── Desktop ─────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-[#1C3A2E] min-h-screen fixed left-0 top-0 z-40">
        <Brand />
        <div className="flex-1 overflow-y-auto">
          <NavLinks />
        </div>
        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-[11px] text-white/25">Content Manager v1</p>
        </div>
      </aside>

      {/* ── Mobile top bar ──────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 z-50 bg-[#1C3A2E] flex items-center justify-between px-4 shadow-md">
        <Brand />
        <button
          onClick={() => setOpen(!open)}
          className="text-white p-1.5 rounded hover:bg-white/10 transition-colors"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Mobile drawer ───────────────────────── */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex pt-14">
          <div className="w-56 bg-[#1C3A2E] shadow-xl">
            <NavLinks onNav={() => setOpen(false)} />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  )
}
