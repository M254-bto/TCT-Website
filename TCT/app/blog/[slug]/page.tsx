import { getBlogPosts, getBlogPostBySlug } from '@/lib/content'
import PageBanner from '@/components/ui/PageBanner'
import { Section } from '@/components/ui/Section'
import { formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Calendar, Tag, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} — Trinity Chapel Thika`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()

  // Get all posts for related articles
  const allPosts = await getBlogPosts()
  const related = allPosts.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 2)

  return (
    <>
      <PageBanner
        title={post.title}
        subtitle={post.author ? `By ${post.author}` : undefined}
        crumbs={[{ label: 'Blog', href: '/blog' }, { label: post.title }]}
      />

      <Section className="bg-[#FAFAF7]">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* ── Sidebar ───────────────────────────────── */}
          <aside className="lg:col-span-1 order-2 lg:order-1 space-y-6">
            {/* Article meta card */}
            <div className="rounded-2xl border border-[#EAE2D6] bg-white overflow-hidden">
              <div className="px-6 py-4 border-b border-[#EAE2D6]">
                <h3 className="font-serif text-lg text-[#1C3A2E]">About this article</h3>
              </div>
              <div className="px-6 py-5 space-y-4">
                {post.author && (
                  <div className="flex items-center gap-3">
                    <User size={15} className="text-[#C9A845] shrink-0" />
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-[#6B7280] mb-0.5">Author</div>
                      <div className="text-sm font-medium text-[#1A1A1A]">{post.author}</div>
                    </div>
                  </div>
                )}
                {post.date && (
                  <div className="flex items-center gap-3">
                    <Calendar size={15} className="text-[#C9A845] shrink-0" />
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-[#6B7280] mb-0.5">Published</div>
                      <div className="text-sm font-medium text-[#1A1A1A]">{formatDate(post.date)}</div>
                    </div>
                  </div>
                )}
                {post.category && (
                  <div className="flex items-center gap-3">
                    <Tag size={15} className="text-[#C9A845] shrink-0" />
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-[#6B7280] mb-0.5">Category</div>
                      <div className="text-sm font-medium text-[#1A1A1A]">{post.category}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Related articles */}
            {related.length > 0 && (
              <div className="rounded-2xl border border-[#EAE2D6] bg-white overflow-hidden">
                <div className="px-6 py-4 border-b border-[#EAE2D6]">
                  <h3 className="font-serif text-lg text-[#1C3A2E]">Related Articles</h3>
                </div>
                <div className="divide-y divide-[#EAE2D6]">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/blog/${r.slug}`}
                      className="group flex items-start gap-3 px-6 py-4 hover:bg-[#FAFAF7] transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[#1A1A1A] leading-snug group-hover:text-[#1C3A2E] transition-colors line-clamp-2">
                          {r.title}
                        </div>
                        {r.date && (
                          <div className="text-xs text-[#6B7280] mt-1">{formatDate(r.date)}</div>
                        )}
                      </div>
                      <ArrowRight size={13} className="shrink-0 mt-0.5 text-[#6B7280] group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Back link */}
            <Link
              href="/blog"
              className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1C3A2E] transition-colors"
            >
              <ArrowLeft size={15} />
              Back to Blog
            </Link>
          </aside>

          {/* ── Article Body ──────────────────────────── */}
          <article className="lg:col-span-2 order-1 lg:order-2">
            {/* Excerpt lead */}
            {post.excerpt && (
              <p className="font-serif text-2xl text-[#1C3A2E] leading-relaxed mb-8 pb-8 border-b border-[#EAE2D6]">
                {post.excerpt}
              </p>
            )}

            {/* Prose content */}
            <div
              className="prose prose-slate max-w-none
                prose-headings:font-serif prose-headings:text-[#1C3A2E]
                prose-p:text-[#1A1A1A]/80 prose-p:leading-relaxed
                prose-a:text-[#2D6A4F] prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-[#C9A845] prose-blockquote:text-[#1C3A2E] prose-blockquote:font-serif prose-blockquote:text-xl
                prose-strong:text-[#1A1A1A]"
              dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
            />
          </article>
        </div>
      </Section>
    </>
  )
}
