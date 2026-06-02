import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkAdminAuth } from '@/lib/auth'

type RouteContext = { params: Promise<{ id: string }> }

// GET /api/blogs/[id]
export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params
  const { data, error } = await supabaseAdmin
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

// PUT /api/blogs/[id] - update blog
export async function PUT(request: Request, { params }: RouteContext) {
  const authed = await checkAdminAuth()
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json() as {
    title?: string
    excerpt?: string
    content?: string
    cover_image?: string
    published?: boolean
    meta_title?: string
    meta_description?: string
  }

  const { title, excerpt, content, cover_image, published, meta_title, meta_description } = body

  const updates: Record<string, unknown> = {
    excerpt,
    content,
    cover_image,
    published,
    meta_title,
    meta_description,
    updated_at: new Date().toISOString(),
  }

  if (title) {
    updates.title = title
    updates.slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const { data, error } = await supabaseAdmin
    .from('blogs')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE /api/blogs/[id]
export async function DELETE(_request: Request, { params }: RouteContext) {
  const authed = await checkAdminAuth()
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { error } = await supabaseAdmin
    .from('blogs')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
