import { NextRequest, NextResponse } from 'next/server'
import { readJson, writeJson, slugify } from '@/lib/content-utils'

const FILES: Record<string, string> = {
  sermons: 'sermons.json',
  events: 'events.json',
  ministries: 'ministries.json',
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params
  const file = FILES[type]
  if (!file) return NextResponse.json({ error: 'Unknown type' }, { status: 404 })
  try {
    return NextResponse.json(readJson(file))
  } catch {
    return NextResponse.json({ error: 'Read failed' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params
  const file = FILES[type]
  if (!file) return NextResponse.json({ error: 'Unknown type' }, { status: 404 })
  try {
    const body = await req.json()
    if (!body.slug) body.slug = slugify(String(body.title ?? body.name ?? 'item'))
    const items = readJson<Record<string, unknown>[]>(file)
    if (items.some((i) => i.slug === body.slug)) body.slug = `${body.slug}-${Date.now()}`
    items.push(body)
    writeJson(file, items)
    return NextResponse.json(body, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Save failed' }, { status: 500 })
  }
}
