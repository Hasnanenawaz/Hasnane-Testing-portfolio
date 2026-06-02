import Link from 'next/link'
import { supabase, type Blog } from '@/lib/supabase'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Hasnane Nawaz',
  description: 'Social media marketing insights and tips by Hasnane Nawaz.',
}

export const revalidate = 60

async function getBlogs(): Promise<Pick<Blog, 'id' | 'title' | 'slug' | 'excerpt' | 'cover_image' | 'created_at'>[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select('id, title, slug, excerpt, cover_image, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
  if (error) return []
  return data ?? []
}

export default async function BlogPage() {
  const blogs = await getBlogs()

  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0f0c',
      fontFamily: "'Segoe UI', Georgia, sans-serif",
      padding: '60px 24px',
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ marginBottom: 56, textAlign: 'center' }}>
          <h1 style={{
            fontSize: 42, fontWeight: 800, color: '#e8f5e9',
            margin: '0 0 12px', letterSpacing: '-0.02em',
          }}>Blog</h1>
          <p style={{ color: '#7ab893', fontSize: 17, margin: 0 }}>
            Social media insights, marketing tips &amp; real talk.
          </p>
        </div>

        {blogs.length === 0 && (
          <div style={{ textAlign: 'center', color: '#4a7a5e', fontSize: 16, paddingTop: 60 }}>
            <p>No posts yet. Check back soon! 🌿</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {blogs.map(blog => (
            <Link key={blog.id} href={`/blog/${blog.slug}`} style={{ textDecoration: 'none' }}>
              <article style={{
                background: '#0d1f18',
                border: '1px solid #1a3328',
                borderRadius: 16,
                overflow: 'hidden',
                display: 'flex',
                transition: 'border-color 0.2s, transform 0.2s',
              }}>
                {blog.cover_image && (
                  <div style={{ flexShrink: 0, width: 200 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={blog.cover_image}
                      alt={blog.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div style={{ padding: '28px 32px', flex: 1 }}>
                  <p style={{ color: '#4a7a5e', fontSize: 12, margin: '0 0 10px', fontWeight: 600, letterSpacing: '0.06em' }}>
                    {new Date(blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <h2 style={{ color: '#e8f5e9', fontSize: 20, fontWeight: 700, margin: '0 0 10px', lineHeight: 1.3 }}>
                    {blog.title}
                  </h2>
                  {blog.excerpt && (
                    <p style={{ color: '#7ab893', fontSize: 14, margin: '0 0 16px', lineHeight: 1.6 }}>
                      {blog.excerpt}
                    </p>
                  )}
                  <span style={{ color: '#5cb87a', fontSize: 13, fontWeight: 600 }}>Read more →</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
