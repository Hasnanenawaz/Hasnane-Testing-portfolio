import Link from 'next/link'
import { supabase, type Blog } from '@/lib/supabase'
import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Blog | Hasnane Nawaz',
  description: 'Social media marketing insights, community growth tips, and real talk from Hasnane Nawaz.',
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
  openGraph: {
    title: 'Blog | Hasnane Nawaz',
    description: 'Social media marketing insights, community growth tips, and real talk from Hasnane Nawaz.',
    url: `${siteConfig.url}/blog`,
    type: 'website',
  },
}

export const revalidate = 60

type BlogCard = Pick<Blog, 'id' | 'title' | 'slug' | 'excerpt' | 'cover_image' | 'created_at'>

async function getBlogs(): Promise<BlogCard[]> {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('id, title, slug, excerpt, cover_image, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
    if (error) return []
    return data ?? []
  } catch {
    return []
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).toUpperCase()
}

export default async function BlogPage() {
  const blogs = await getBlogs()

  const blogCollectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Hasnane Nawaz Blog',
    description: 'Social media marketing insights, community growth tips, and real talk.',
    url: `${siteConfig.url}/blog`,
    author: {
      '@type': 'Person',
      name: 'Hasnane Nawaz',
      url: siteConfig.url,
    },
    blogPost: blogs.map(b => ({
      '@type': 'BlogPosting',
      headline: b.title,
      url: `${siteConfig.url}/blog/${b.slug}`,
      datePublished: b.created_at,
      description: b.excerpt ?? undefined,
      image: b.cover_image ?? undefined,
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteConfig.url}/blog` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogCollectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="min-h-screen bg-[#f5f0e8] pt-24 pb-20">
        <div className="container">

          {/* ── Header ── */}
          <div className="text-center mb-14">
            <h1 className="font-display text-5xl md:text-6xl font-black text-[#1e3a24] mb-3">
              Blog
            </h1>
            <p className="text-[#5a6b52] text-base md:text-lg max-w-sm mx-auto leading-relaxed">
              Social media insights, marketing tips &amp; real talk.
            </p>
            <div className="w-10 h-[3px] bg-[#1e3a24] mx-auto mt-5 rounded" />
          </div>

          {/* ── Empty state ── */}
          {blogs.length === 0 && (
            <div className="text-center py-24">
              <p className="text-[#5a6b52] text-lg">No posts yet — check back soon!</p>
            </div>
          )}

          {/* ── Card grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map(blog => (
              <Link key={blog.id} href={`/blog/${blog.slug}`} className="group block">
                <article className="bg-white rounded-2xl overflow-hidden border border-[#e8e3d8] shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 flex flex-col h-full">

                  {/* Cover image */}
                  {blog.cover_image ? (
                    <div className="aspect-video overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={blog.cover_image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-[#e8e3d8] flex items-center justify-center">
                      <span className="text-4xl opacity-40">📝</span>
                    </div>
                  )}

                  {/* Card body */}
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-[11px] font-bold tracking-widest text-[#7a8a6a] mb-2">
                      {formatDate(blog.created_at)}
                    </p>
                    <h2 className="font-display font-bold text-[#1e3a24] text-lg leading-snug mb-2 line-clamp-2">
                      {blog.title}
                    </h2>
                    {blog.excerpt && (
                      <p className="text-[#5a6b52] text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                        {blog.excerpt}
                      </p>
                    )}
                    <span className="text-sm font-bold text-[#1e3a24] mt-auto group-hover:underline">
                      Read more →
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>

        </div>
      </main>
    </>
  )
}
