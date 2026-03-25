import { NextRequest, NextResponse } from 'next/server'
import { readBlogPost, writeBlogPost, deleteBlogPost } from '@/lib/content-utils'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = readBlogPost(slug)
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const body = await req.json()
  writeBlogPost({ ...body, slug })
  return NextResponse.json({ ...body, slug })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  deleteBlogPost(slug)
  return NextResponse.json({ success: true })
}
