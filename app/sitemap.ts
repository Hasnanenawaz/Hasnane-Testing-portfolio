import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: blogs } = await supabase
    .from('blogs')
    .select('slug, updated_at')
    .eq('published', true)
    .order('updated_at', { ascending: false })

  const blogEntries: MetadataRoute.Sitemap = (blogs ?? []).map(blog => ({
    url: `${siteConfig.url}/blog/${blog.slug}`,
    lastModified: new Date(blog.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...blogEntries,
  ]
}
