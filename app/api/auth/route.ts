import { NextResponse } from 'next/server'
import { verifyPassword, SESSION_SECRET } from '@/lib/auth'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { password?: string } | null
  const password = body?.password ?? ''

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_session', SESSION_SECRET, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return response
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('admin_session')
  return response
}
