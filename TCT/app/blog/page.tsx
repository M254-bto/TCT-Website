import { getBlogPosts } from '@/lib/content'
import PageBanner from '@/components/ui/PageBanner'
import { Section } from '@/components/ui/Section'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — Trinity Chapel Thika',
  description: 'Reflections, teachings, and stories from the Trinity Chapel Thika community.',
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <>
      <PageBanner
        title="Blog"
        subtitle="Reflections, teachings, and stories from our community"
        crumbs={[{ label: 'Blog' }]}
      />

      <Section className="bg-[#FAFAF7]">
        {posts.length === 0 ? (
          <div className="py-24 text-center">
            <BookOpen className="mx-auto mb-4 text-[#C9A845]" size={40} strokeWidth={1.5} />
            <p className="text-lg text-[#6B7280]">No posts yet. Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Featured post — first item */}
            {posts[0] && (
              <div className="mb-14">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A845]">Featured</span>
                  <div className="h-px flex-1 bg-[#EAE2D6]" />
                </div>
                <Link
                  href={`/blog/${posts[0].slug}`}
                  className="group grid md:grid-cols-5 gap-0 rounded-2xl border border-[#EAE2D6] bg-white overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  {/* Cover placeholder */}
                  <div
                    className="md:col-span-2 min-h-[220px] flex items-end p-7"
                    style={{ background: 'linear-gradient(135deg,#1C3A2E 0%,#2D6A4F 100%)' }}
                  >
                    {posts[0].category && (
                      <span
                        className="text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full"
                        style={{ background: 'rgba(201,168,69,0.2)', color: '#C9A845' }}
                      >
                        {posts[0].category}
                      </span>
                    )}
                  </div>

                  {/* Text */}
                  <div className="md:col-span-3 flex flex-col justify-center px-8 py-8">
                    <h2 className="font-serif text-3xl text-[#1A1A1A] leading-snug mb-3 group-hover:text-[#1C3A2E] transition-colors">
                      {posts[0].title}
                    </h2>
                    <p className="text-[#6B7280] leading-relaxed mb-5 line-clamp-3">{posts[0].excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-[#6B7280]">
                        <span className="font-medium text-[#1A1A1A]">{posts[0].author}</span>
                        {posts[0].date && <> &nbsp;·&nbsp; {formatDate(posts[0].date)}</>}
                      </div>
                      <span className="flex items-center gap-1.5 text-sm font-medium text-[#1C3A2E]">
                        Read article
                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Rest of posts */}
            {posts.length > 1 && (
              <>
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#6B7280]">All Posts</span>
                  <div className="h-px flex-1 bg-[#EAE2D6]" />
                </div>
                <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                  {posts.slice(1).map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </Section>
    </>
  )
}

// ─── Blog Card ────────────────────────────────────────────────────────────────

interface BlogCardProps {
  post: {
    slug: string
    title: string
    date?: string
    category?: string
    author?: string
    excerpt?: string
  }
}

function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl border border-[#EAE2D6] bg-white overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Cover placeholder */}
      <div
        className="h-40 flex items-end px-5 py-5"
        style={{ background: 'linear-gradient(135deg,#1C3A2E 0%,#2D6A4F 100%)' }}
      >
        {post.category && (
          <span
            className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(201,168,69,0.2)', color: '#C9A845' }}
          >
            {post.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-5 py-5">
        <h3 className="font-serif text-xl text-[#1A1A1A] leading-snug mb-2 group-hover:text-[#1C3A2E] transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-3 flex-1 mb-4">{post.excerpt}</p>
        )}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#EAE2D6]">
          <div className="text-xs text-[#6B7280]">
            {post.author && <span className="font-medium text-[#1A1A1A] mr-1">{post.author}</span>}
            {post.date && <span>{formatDate(post.date)}</span>}
          </div>
          <ArrowRight size={14} className="text-[#1C3A2E] group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  )
}
