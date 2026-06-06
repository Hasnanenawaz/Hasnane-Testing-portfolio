import { createClient } from '@supabase/supabase-js'

// Use fallback strings so createClient never throws at module init time.
// If env vars are missing the clients will exist but queries will return errors,
// which the callers already handle with `if (error) return []`.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key'
// Service-role key is server-only; fall back to anon key so the import
// from the blog server component never crashes even when the secret is absent.
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseAnonKey

// Client for public use (reading published blogs)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_image: string | null
  published: boolean
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
}

export type BlogInsert = Omit<Blog, 'id' | 'created_at' | 'updated_at'>
