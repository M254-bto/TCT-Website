'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Calendar, Users, FileText, ArrowRight, Settings } from 'lucide-react'

interface Counts {
  sermons: number
  events: number
  ministries: number
  blog: number
}

const statCards = [
  { key: 'sermons' as const, label: 'Sermons', href: '/sermons', icon: BookOpen, bg: '#1C3A2E' },
  { key: 'events' as const, label: 'Events', href: '/events', icon: Calendar, bg: '#2D6A4F' },
  { key: 'ministries' as const, label: 'Ministries', href: '/ministries', icon: Users, bg: '#1C3A2E' },
  { key: 'blog' as const, label: 'Blog Posts', href: '/blog', icon: FileText, bg: '#2D6A4F' },
]

const quickActions = [
  { href: '/sermons', label: 'Manage Sermons', icon: BookOpen },
  { href: '/events', label: 'Manage Events', icon: Calendar },
  { href: '/ministries', label: 'Manage Ministries', icon: Users },
  { href: '/blog', label: 'Manage Blog', icon: FileText },
  { href: '/site', label: 'Site Configuration', icon: Settings },
]

export default function DashboardPage() {
  const [counts, setCounts] = useState<Counts>({ sermons: 0, events: 0, ministries: 0, blog: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/content/sermons').then((r) => r.json()),
      fetch('/api/content/events').then((r) => r.json()),
      fetch('/api/content/ministries').then((r) => r.json()),
      fetch('/api/blog').then((r) => r.json()),
    ])
      .then(([sermons, events, ministries, blog]) => {
        setCounts({
          sermons: Array.isArray(sermons) ? sermons.length : 0,
          events: Array.isArray(events) ? events.length : 0,
          ministries: Array.isArray(ministries) ? ministries.length : 0,
          blog: Array.isArray(blog) ? blog.length : 0,
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Manage Trinity Chapel Thika content</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map(({ key, label, href, icon: Icon, bg }) => (
          <Link
            key={key}
            href={href}
            className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
              style={{ background: bg }}
            >
              <Icon size={18} className="text-white" />
            </div>
            {loading ? (
              <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mb-1" />
            ) : (
              <div className="text-3xl font-bold text-gray-900 mb-0.5">{counts[key]}</div>
            )}
            <div className="text-sm text-gray-500">{label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-[#1C3A2E]/40 hover:shadow-sm transition-all text-sm font-medium text-gray-700 hover:text-[#1C3A2E] group"
            >
              <span className="flex items-center gap-3">
                <Icon size={16} />
                {label}
              </span>
              <ArrowRight size={14} className="text-gray-300 group-hover:text-[#1C3A2E] transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
