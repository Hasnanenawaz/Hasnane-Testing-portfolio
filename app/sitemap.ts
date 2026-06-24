import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogEntries: MetadataRoute.Sitemap = [];

  try {
    const { data: blogs } = await supabase
      .from("blogs")
      .select("slug, updated_at")
      .eq("published", true)
      .order("updated_at", { ascending: false });

    blogEntries = (blogs ?? []).map((blog) => ({
      url: `${siteConfig.url}/blog/${blog.slug}`,
      lastModified: new Date(blog.updated_at),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    // Supabase unavailable — serve static pages only
  }

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...blogEntries,
  ];
}
