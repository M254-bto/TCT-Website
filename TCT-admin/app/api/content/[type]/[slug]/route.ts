import { NextRequest, NextResponse } from 'next/server'
import { readJson, writeJson } from '@/lib/content-utils'

const FILES: Record<string, string> = {
  sermons: 'sermons.json',
  events: 'events.json',
  ministries: 'ministries.json',
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ type: string; slug: string }> }
) {
  const { type, slug } = await params
  const file = FILES[type]
  if (!file) return NextResponse.json({ error: 'Unknown type' }, { status: 404 })
  const items = await readJson<Record<string, unknown>[]>(file)
  const item = items.find((i) => i.slug === slug)
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ type: string; slug: string }> }
) {
  const { type, slug } = await params
  const file = FILES[type]
  if (!file) return NextResponse.json({ error: 'Unknown type' }, { status: 404 })
  const body = await req.json()
  const items = await readJson<Record<string, unknown>[]>(file)
  const idx = items.findIndex((i) => i.slug === slug)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  items[idx] = { ...items[idx], ...body, slug }
  await writeJson(file, items)
  return NextResponse.json(items[idx])
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ type: string; slug: string }> }
) {
  const { type, slug } = await params
  const file = FILES[type]
  if (!file) return NextResponse.json({ error: 'Unknown type' }, { status: 404 })
  const items = await readJson<Record<string, unknown>[]>(file)
  const filtered = items.filter((i) => i.slug !== slug)
  if (filtered.length === items.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await writeJson(file, filtered)
  return NextResponse.json({ success: true })
}
