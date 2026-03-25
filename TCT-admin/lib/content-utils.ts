import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export const CONTENT_DIR = path.resolve(
  process.cwd(),
  process.env.CONTENT_DIR ?? '../TCT/content'
)

export function readJson<T>(filename: string): T {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf8')
  return JSON.parse(raw) as T
}

export function writeJson(filename: string, data: unknown): void {
  fs.writeFileSync(
    path.join(CONTENT_DIR, filename),
    JSON.stringify(data, null, 2) + '\n',
    'utf8'
  )
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ─── Blog ────────────────────────────────────────────────────────────────────

export interface BlogPost {
  slug: string
  title: string
  date?: string
  category?: string
  author?: string
  excerpt?: string
  coverImage?: string
  content: string
}

export function readBlogPosts(): BlogPost[] {
  const blogDir = path.join(CONTENT_DIR, 'blog')
  return fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '')
      const { data, content } = matter(fs.readFileSync(path.join(blogDir, file), 'utf8'))
      return { slug, content, ...data } as BlogPost
    })
}

export function readBlogPost(slug: string): BlogPost | null {
  const filePath = path.join(CONTENT_DIR, 'blog', `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  const { data, content } = matter(fs.readFileSync(filePath, 'utf8'))
  return { slug, content, ...data } as BlogPost
}

export function writeBlogPost(post: BlogPost): void {
  const { slug, content, ...fm } = post
  fs.writeFileSync(
    path.join(CONTENT_DIR, 'blog', `${slug}.md`),
    matter.stringify(content || '', fm),
    'utf8'
  )
}

export function deleteBlogPost(slug: string): void {
  const filePath = path.join(CONTENT_DIR, 'blog', `${slug}.md`)
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
}
