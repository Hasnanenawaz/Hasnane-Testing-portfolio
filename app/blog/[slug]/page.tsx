import { supabaseAdmin as supabase, type Blog } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site-config'

export const revalidate = 60

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const { data } = await supabase
      .from('blogs')
      .select('title, excerpt, meta_title, meta_description, cover_image, created_at, updated_at')
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
        type: 'article',
        locale: 'en_IN',
        publishedTime: data.created_at ?? undefined,
        modifiedTime: data.updated_at ?? undefined,
        authors: [siteConfig.url],
      },
      twitter: {
        card: 'summary_large_image',
        title: data.meta_title ?? data.title,
        description: data.meta_description ?? data.excerpt ?? undefined,
        images: data.cover_image ? [data.cover_image] : [],
      },
      alternates: {
        canonical: `${siteConfig.url}/blog/${slug}`,
      },
    }
  } catch {
    return { title: 'Blog' }
  }
}

export async function generateStaticParams() {
  const { data: blogs } = await supabase
    .from('blogs')
    .select('slug')
    .eq('published', true)
  return (blogs ?? []).map(b => ({ slug: b.slug }))
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

function isBuilderHTML(content: string) {
  return content.includes('hn-article')
}

function renderContent(content: string) {
  if (isBuilderHTML(content)) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />
  }
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim())
  if (paragraphs.length <= 1) {
    return (
      <div className="text-[#1a1a14] text-base md:text-[17px] leading-[1.9] whitespace-pre-wrap break-words">
        {content}
      </div>
    )
  }
  return (
    <div className="text-[#1a1a14] text-base md:text-[17px] leading-[1.9] space-y-5">
      {paragraphs.map((para, i) => (
        <p key={i}>
          {para.split('\n').map((line, j, arr) =>
            j < arr.length - 1 ? [line, <br key={j} />] : line
          )}
        </p>
      ))}
    </div>
  )
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const blog = await getBlog(slug)
  if (!blog) notFound()

  const wordCount = blog.content ? blog.content.split(/\s+/).filter(Boolean).length : undefined
  const articleBody = blog.content
    ? blog.content.slice(0, 500) + (blog.content.length > 500 ? '…' : '')
    : undefined

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${siteConfig.url}/blog/${blog.slug}#article`,
    headline: blog.title,
    description: blog.excerpt ?? undefined,
    articleBody,
    image: blog.cover_image ?? undefined,
    datePublished: blog.created_at,
    dateModified: blog.updated_at,
    inLanguage: 'en-IN',
    wordCount,
    url: `${siteConfig.url}/blog/${blog.slug}`,
    author: {
      '@type': 'Person',
      '@id': `${siteConfig.url}/#person`,
      name: 'Hasnane Nawaz',
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Person',
      '@id': `${siteConfig.url}/#person`,
      name: 'Hasnane Nawaz',
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/blog/${blog.slug}`,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteConfig.url}/blog` },
      { '@type': 'ListItem', position: 3, name: blog.title, item: `${siteConfig.url}/blog/${blog.slug}` },
    ],
  }

  const builderPost = !!(blog.content && isBuilderHTML(blog.content))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="min-h-screen bg-[#f5f0e8] pt-24 pb-20">
        <div className={`container ${builderPost ? 'max-w-4xl' : 'max-w-3xl'}`}>

          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-[#5a6b52] hover:text-[#1e3a24] transition-colors mb-10 font-medium"
          >
            ← Back to Blog
          </Link>

          {builderPost ? (
            /* Builder HTML — already contains its own header, title, byline, content */
            <div className="bg-[#F4EEE2] rounded-2xl p-6 md:p-10">
              {blog.content ? renderContent(blog.content) : null}
            </div>
          ) : (
            /* Plain text post */
            <article>
              <p className="text-[11px] font-bold tracking-widest text-[#7a8a6a] mb-3 uppercase">
                {formatDate(blog.created_at)}
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-black text-[#1e3a24] leading-tight mb-4">
                {blog.title}
              </h1>
              {blog.cover_image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={blog.cover_image}
                  alt={blog.title}
                  className="w-full rounded-xl mb-8 max-h-[480px] object-cover border border-[#e8e3d8]"
                />
              )}
              {blog.excerpt && (
                <p className="text-lg text-[#5a6b52] leading-relaxed mb-8 border-l-4 border-[#1e3a24] pl-4">
                  {blog.excerpt}
                </p>
              )}
              {blog.content ? renderContent(blog.content) : null}
            </article>
          )}

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
    </>
  )
}
