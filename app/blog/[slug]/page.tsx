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

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const blog = await getBlog(slug)
  if (!blog) notFound()

  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0f0c',
      fontFamily: "'Segoe UI', Georgia, sans-serif",
      padding: '60px 24px',
    }}>
      <div style={{ maxWidth: 740, margin: '0 auto' }}>
        <Link href="/blog" style={{
          color: '#7ab893', fontSize: 14, textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 40,
        }}>← Back to Blog</Link>

        <article>
          <p style={{ color: '#4a7a5e', fontSize: 12, margin: '0 0 14px', fontWeight: 600, letterSpacing: '0.06em' }}>
            {new Date(blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h1 style={{
            color: '#e8f5e9', fontSize: 36, fontWeight: 800,
            margin: '0 0 20px', lineHeight: 1.2, letterSpacing: '-0.02em',
          }}>{blog.title}</h1>
          {blog.excerpt && (
            <p style={{ color: '#7ab893', fontSize: 18, margin: '0 0 36px', lineHeight: 1.6, fontStyle: 'italic' }}>
              {blog.excerpt}
            </p>
          )}
          {blog.cover_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={blog.cover_image}
              alt={blog.title}
              style={{ width: '100%', borderRadius: 14, marginBottom: 44, maxHeight: 420, objectFit: 'cover' }}
            />
          )}
          <div
            style={{
              color: '#c8e6c9', fontSize: 17, lineHeight: 1.9,
              whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            }}
          >
            {blog.content}
          </div>
        </article>

        <div style={{ borderTop: '1px solid #1a3328', marginTop: 60, paddingTop: 40, textAlign: 'center' }}>
          <Link
            href="/blog"
            style={{
              display: 'inline-block', padding: '12px 28px', borderRadius: 10,
              border: '1.5px solid #2e7d52', color: '#5cb87a',
              fontSize: 14, fontWeight: 600, textDecoration: 'none',
            }}
          >← All Posts</Link>
        </div>
      </div>
    </main>
  )
}
