import { NextRequest, NextResponse } from 'next/server'
import { readBlogPosts, writeBlogPost, slugify } from '@/lib/content-utils'

export async function GET() {
  try {
    return NextResponse.json(readBlogPosts())
  } catch {
    return NextResponse.json({ error: 'Read failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.slug) body.slug = slugify(String(body.title ?? 'post'))
    writeBlogPost(body)
    return NextResponse.json(body, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Save failed' }, { status: 500 })
  }
}
