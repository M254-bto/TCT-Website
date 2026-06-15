import { NextRequest, NextResponse } from 'next/server'
import { readBlogs, writeBlog, deleteBlog } from '@/lib/content-utils'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const blogs = await readBlogs()
    const blog = blogs.find((b) => b.slug === slug)
    if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(blog)
  } catch (err) {
    console.error('Failed to get blog:', err)
    return NextResponse.json({ error: 'Get failed' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await req.json()
    const blogs = await readBlogs()
    const existing = blogs.find((b) => b.slug === slug)
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { title, date, category, author, excerpt, coverImage, content } = body

    const updated = {
      title: title ?? existing.title,
      date: date ?? existing.date,
      category: category ?? existing.category,
      author: author ?? existing.author,
      excerpt: excerpt ?? existing.excerpt,
      coverImage: coverImage ?? existing.coverImage,
      content: content ?? existing.content,
    }

    await writeBlog(slug, updated)
    return NextResponse.json({ slug, ...updated })
  } catch (err) {
    console.error('Failed to update blog:', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const blogs = await readBlogs()
    const existing = blogs.find((b) => b.slug === slug)
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await deleteBlog(slug)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Failed to delete blog:', err)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
