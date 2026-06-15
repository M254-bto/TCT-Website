import { NextRequest, NextResponse } from 'next/server'
import { readBlogs, writeBlog, slugify } from '@/lib/content-utils'

export async function GET() {
  try {
    const blogs = await readBlogs()
    return NextResponse.json(blogs)
  } catch (err) {
    console.error('Failed to read blogs:', err)
    return NextResponse.json({ error: 'Read failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, date, category, author, excerpt, coverImage, content } = body
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    const slug = slugify(String(title))
    
    // Check if blog already exists
    const blogs = await readBlogs()
    let uniqueSlug = slug
    if (blogs.some((b) => b.slug === uniqueSlug)) {
      uniqueSlug = `${slug}-${Date.now()}`
    }

    await writeBlog(uniqueSlug, {
      title,
      date: date || new Date().toISOString().split('T')[0],
      category: category || 'General',
      author: author || 'Trinity Chapel Thika',
      excerpt: excerpt || '',
      coverImage: coverImage || '',
      content: content || '',
    })

    return NextResponse.json({ slug: uniqueSlug, title }, { status: 201 })
  } catch (err) {
    console.error('Failed to save blog:', err)
    return NextResponse.json({ error: 'Save failed' }, { status: 500 })
  }
}
