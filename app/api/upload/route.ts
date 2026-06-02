import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkAdminAuth } from '@/lib/auth'

export async function POST(request: Request) {
  const authed = await checkAdminAuth()
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('image') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const ext = file.name.split('.').pop()
  const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

  const { error } = await supabaseAdmin.storage
    .from('blog-images')
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: urlData } = supabaseAdmin.storage
    .from('blog-images')
    .getPublicUrl(filename)

  return NextResponse.json({ url: urlData.publicUrl })
}
