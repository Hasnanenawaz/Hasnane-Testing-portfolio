import { supabase, type Blog } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 60

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const { data } = await supabase
      .from('blogs')
      .select('title, excerpt, meta_title, meta_description, cover_image')
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (!data) return { title: 'Not Found' }

    return {
      title: data.meta_title ?? data.title,
      description: data.meta_description ?? data.excerpt,
      openGraph: {
        title: data.meta_title ?? data.title,
        description: data.meta_description ?? data.excerpt ?? undefined,
        images: data.cover_image ? [data.cover_image] : [],
      },
    }
  } catch {
    return { title: 'Blog' }
  }
}

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
    return error ? null : data
  } catch {
    return null
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const blog = await getBlog(slug)
  if (!blog) notFound()

  return (
    <main className="min-h-screen bg-[#f5f0e8] pt-24 pb-20">
      <div className="container max-w-3xl">

        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-[#5a6b52] hover:text-[#1e3a24] transition-colors mb-10 font-medium"
        >
          ← Back to Blog
        </Link>

        <article>
          {/* Date */}
          <p className="text-[11px] font-bold tracking-widest text-[#7a8a6a] mb-3 uppercase">
            {formatDate(blog.created_at)}
          </p>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-5xl font-black text-[#1e3a24] leading-tight mb-4">
            {blog.title}
          </h1>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="text-lg text-[#5a6b52] leading-relaxed mb-8 border-l-4 border-[#1e3a24] pl-4">
              {blog.excerpt}
            </p>
          )}

          {/* Cover image */}
          {blog.cover_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={blog.cover_image}
              alt={blog.title}
              className="w-full rounded-xl mb-10 max-h-[480px] object-cover border border-[#e8e3d8]"
            />
          )}

          {/* Content */}
          <div className="text-[#1a1a14] text-base md:text-[17px] leading-[1.9] whitespace-pre-wrap break-words">
            {blog.content}
          </div>
        </article>

        {/* Footer nav */}
        <div className="border-t-2 border-[#1e3a24] mt-16 pt-10 text-center">
          <Link
            href="/blog"
            className="inline-block px-7 py-3 rounded-lg border-2 border-[#1e3a24] font-bold text-sm text-[#1e3a24] hover:bg-[#1e3a24] hover:text-white transition-colors"
          >
            ← All Posts
          </Link>
        </div>

      </div>
    </main>
  )
}
