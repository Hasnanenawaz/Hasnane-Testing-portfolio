import { cookies } from 'next/headers'

const SESSION_SECRET = process.env.SESSION_SECRET ?? 'hasnane-blog-secret-2024'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? ''

export async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return session?.value === SESSION_SECRET
}

export function verifyPassword(password: string): boolean {
  return password === ADMIN_PASSWORD
}

export { SESSION_SECRET }
