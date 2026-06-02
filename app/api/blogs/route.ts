import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkAdminAuth } from '@/lib/auth'

// GET /api/blogs - returns all blogs (admin: all, public: published only)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const adminMode = searchParams.get('admin') === 'true'

  if (adminMode) {
    const authed = await checkAdminAuth()
    if (!authed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  let query = supabaseAdmin
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false })

  if (!adminMode) {
    query = query.eq('published', true)
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/blogs - create new blog
export async function POST(request: Request) {
  const authed = await checkAdminAuth()
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json() as {
    title: string
    excerpt?: string
    content?: string
    cover_image?: string
    published?: boolean
    meta_title?: string
    meta_description?: string
  }

  const { title, excerpt, content, cover_image, published, meta_title, meta_description } = body

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

  const { data, error } = await supabaseAdmin
    .from('blogs')
    .insert([{ title, slug, excerpt, content, cover_image, published, meta_title, meta_description }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
