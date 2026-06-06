'use client'
import { useState, useEffect, useRef, ChangeEvent, DragEvent, KeyboardEvent } from 'react'
import { useTheme } from '@/components/providers/theme-provider'
import type { Blog } from '@/lib/supabase'

// ─── Palette ──────────────────────────────────────────────────────────────────
type Palette = {
  bg: string; surface: string; card: string; border: string; borderStrong: string
  text: string; textMuted: string; textSubtle: string
  green: string; greenDim: string; greenText: string
  inputBg: string; inputBorder: string; inputFocus: string; placeholder: string
  pubBg: string; pubText: string; pubBorder: string
  draftBg: string; draftText: string; draftBorder: string
  btnPrimary: string; btnPrimaryHover: string; btnPrimaryText: string
  btnGhost: string; btnGhostBorder: string; btnGhostText: string
  btnDanger: string; btnDangerText: string
  btnEdit: string; btnEditText: string
  disabledBg: string; disabledText: string; error: string
  shadow: string; overlay: string
}

const dark: Palette = {
  bg: '#071410',
  surface: '#0c1c16',
  card: '#0f2018',
  border: '#1e3d2f',
  borderStrong: '#2e5c44',
  text: '#e2f3e8',
  textMuted: '#89c4a1',
  textSubtle: '#5a8c72',
  green: '#4ade80',
  greenDim: '#22c55e',
  greenText: '#86efac',
  inputBg: '#0c1c16',
  inputBorder: '#2a5040',
  inputFocus: '#4ade80',
  placeholder: '#1a3228',
  pubBg: '#0e2d1d',
  pubText: '#4ade80',
  pubBorder: '#1a5232',
  draftBg: '#1f1408',
  draftText: '#fbbf24',
  draftBorder: '#78450e',
  btnPrimary: '#16a34a',
  btnPrimaryHover: '#15803d',
  btnPrimaryText: '#ffffff',
  btnGhost: 'transparent',
  btnGhostBorder: '#2e5c44',
  btnGhostText: '#89c4a1',
  btnDanger: '#3d0e0e',
  btnDangerText: '#f87171',
  btnEdit: '#0e2d1d',
  btnEditText: '#4ade80',
  disabledBg: '#1a3228',
  disabledText: '#3d7a5a',
  error: '#f87171',
  shadow: '0 2px 12px rgba(0,0,0,0.5)',
  overlay: 'rgba(0,0,0,0.75)',
}

const light: Palette = {
  bg: '#f0faf4',
  surface: '#e8f5ee',
  card: '#ffffff',
  border: '#c8e6d0',
  borderStrong: '#8dc4a0',
  text: '#0a1f14',
  textMuted: '#2d6b45',
  textSubtle: '#5a8c72',
  green: '#16a34a',
  greenDim: '#15803d',
  greenText: '#14532d',
  inputBg: '#ffffff',
  inputBorder: '#a7d8b8',
  inputFocus: '#16a34a',
  placeholder: '#d1ead9',
  pubBg: '#dcfce7',
  pubText: '#14532d',
  pubBorder: '#86efac',
  draftBg: '#fefce8',
  draftText: '#713f12',
  draftBorder: '#fde68a',
  btnPrimary: '#16a34a',
  btnPrimaryHover: '#15803d',
  btnPrimaryText: '#ffffff',
  btnGhost: 'transparent',
  btnGhostBorder: '#a7d8b8',
  btnGhostText: '#2d6b45',
  btnDanger: '#fef2f2',
  btnDangerText: '#b91c1c',
  btnEdit: '#dcfce7',
  btnEditText: '#14532d',
  disabledBg: '#e8f5ee',
  disabledText: '#8dc4a0',
  error: '#b91c1c',
  shadow: '0 2px 12px rgba(0,0,0,0.08)',
  overlay: 'rgba(0,0,0,0.5)',
}

// ─── Image Uploader ──────────────────────────────────────────────────────────
function ImageUploader({ value, onChange, c }: { value: string; onChange: (v: string) => void; c: Palette }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File | null | undefined) {
    if (!file) return
    setUploading(true)
    setError('')
    const fd = new FormData()
    fd.append('image', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json() as { url?: string; error?: string }
      if (data.url) onChange(data.url)
      else setError(data.error ?? 'Upload failed')
    } catch {
      setError('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e: DragEvent) => e.preventDefault()}
        onDrop={(e: DragEvent) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
        style={{
          border: `2px dashed ${c.inputBorder}`,
          borderRadius: 10, padding: '24px 16px',
          textAlign: 'center', cursor: 'pointer', background: c.inputBg,
          color: c.textMuted, fontSize: 14, transition: 'border-color 0.2s, background 0.2s',
          outline: 'none',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = c.green; e.currentTarget.style.background = c.surface }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = c.inputBorder; e.currentTarget.style.background = c.inputBg }}
        onFocus={e => { e.currentTarget.style.borderColor = c.inputFocus; e.currentTarget.style.outlineOffset = '2px' }}
        onBlur={e => { e.currentTarget.style.borderColor = c.inputBorder }}
      >
        <div style={{ fontSize: 28, marginBottom: 6 }}>🖼️</div>
        {uploading ? (
          <span>Uploading…</span>
        ) : (
          <span>Click or drag a cover image here</span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => handleFile(e.target.files?.[0])}
      />
      {error && (
        <p style={{ color: c.error, fontSize: 12, marginTop: 6, fontWeight: 500 }}>{error}</p>
      )}
      {value && (
        <div style={{ marginTop: 12, position: 'relative', borderRadius: 8, overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Cover preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block' }} />
          <button
            onClick={() => onChange('')}
            style={{
              position: 'absolute', top: 8, right: 8,
              background: 'rgba(0,0,0,0.7)', border: 'none',
              color: '#fff', borderRadius: 6, padding: '4px 10px',
              cursor: 'pointer', fontSize: 12, fontWeight: 600,
            }}
          >Remove</button>
        </div>
      )}
    </div>
  )
}

// ─── Blog Form ───────────────────────────────────────────────────────────────
type BlogFormData = {
  title: string; excerpt: string; content: string; cover_image: string
  published: boolean; meta_title: string; meta_description: string
}

const emptyForm: BlogFormData = {
  title: '', excerpt: '', content: '', cover_image: '',
  published: false, meta_title: '', meta_description: '',
}

const fieldStyle = (c: Palette): React.CSSProperties => ({
  width: '100%', padding: '10px 14px', borderRadius: 8,
  border: `1.5px solid ${c.inputBorder}`, background: c.inputBg,
  color: c.text, fontSize: 14, outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.15s',
})

const labelStyle = (c: Palette): React.CSSProperties => ({
  color: c.textMuted, fontSize: 12, fontWeight: 700,
  letterSpacing: '0.05em', textTransform: 'uppercase',
  marginBottom: 7, display: 'block',
})

function Field({ label, c, children }: { label: string; c: Palette; children: React.ReactNode }) {
  return (
    <div>
      <span style={labelStyle(c)}>{label}</span>
      {children}
    </div>
  )
}

function BlogForm({
  initial, onSave, onCancel, saving, c,
}: {
  initial: Blog | null; onSave: (form: BlogFormData) => void
  onCancel: () => void; saving: boolean; c: Palette
}) {
  const [form, setForm] = useState<BlogFormData>(
    initial
      ? {
          title: initial.title, excerpt: initial.excerpt ?? '',
          content: initial.content ?? '', cover_image: initial.cover_image ?? '',
          published: initial.published, meta_title: initial.meta_title ?? '',
          meta_description: initial.meta_description ?? '',
        }
      : emptyForm
  )
  const set = <K extends keyof BlogFormData>(k: K, v: BlogFormData[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  const inp = fieldStyle(c)

  function focusBorder(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.style.borderColor = c.inputFocus
  }
  function blurBorder(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.style.borderColor = c.inputBorder
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Field label="Blog Title *" c={c}>
        <input
          style={inp} value={form.title}
          onChange={e => set('title', e.target.value)}
          onFocus={focusBorder} onBlur={blurBorder}
          placeholder="Enter your blog title…"
        />
      </Field>

      <Field label="Excerpt — shown on blog listing" c={c}>
        <textarea
          value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
          onFocus={focusBorder} onBlur={blurBorder}
          rows={3} placeholder="A short summary of the post…"
          style={{ ...inp, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
        />
      </Field>

      <Field label="Cover Image" c={c}>
        <ImageUploader value={form.cover_image} onChange={v => set('cover_image', v)} c={c} />
      </Field>

      <Field label="Content" c={c}>
        <textarea
          value={form.content} onChange={e => set('content', e.target.value)}
          onFocus={focusBorder} onBlur={blurBorder}
          rows={18} placeholder="Write your blog content here…"
          style={{ ...inp, resize: 'vertical', fontFamily: 'monospace', fontSize: 13, lineHeight: 1.75 }}
        />
      </Field>

      <div style={{
        background: c.surface, border: `1px solid ${c.border}`,
        borderRadius: 10, padding: '20px 20px 16px',
      }}>
        <p style={{ color: c.green, fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 16px' }}>
          SEO Settings
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Meta Title (defaults to blog title)" c={c}>
            <input
              style={inp} value={form.meta_title}
              onChange={e => set('meta_title', e.target.value)}
              onFocus={focusBorder} onBlur={blurBorder}
              placeholder="SEO-optimised title…"
            />
          </Field>
          <Field label="Meta Description (defaults to excerpt)" c={c}>
            <textarea
              value={form.meta_description} onChange={e => set('meta_description', e.target.value)}
              onFocus={focusBorder} onBlur={blurBorder}
              rows={2} placeholder="SEO meta description…"
              style={{ ...inp, resize: 'vertical', fontFamily: 'inherit' }}
            />
          </Field>
        </div>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
        <input
          type="checkbox" checked={form.published}
          onChange={e => set('published', e.target.checked)}
          style={{ width: 18, height: 18, accentColor: c.green, cursor: 'pointer' }}
        />
        <span style={{ color: c.text, fontSize: 14, fontWeight: 500 }}>
          Publish — make visible at{' '}
          <span style={{ color: c.green }}>/blog</span>
        </span>
      </label>

      <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
        <button
          onClick={() => onSave(form)}
          disabled={!form.title.trim() || saving}
          style={{
            flex: 1, padding: '13px', borderRadius: 10, border: 'none',
            background: form.title.trim() ? c.btnPrimary : c.disabledBg,
            color: form.title.trim() ? c.btnPrimaryText : c.disabledText,
            fontWeight: 700, fontSize: 15, cursor: form.title.trim() ? 'pointer' : 'not-allowed',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { if (form.title.trim()) e.currentTarget.style.background = c.btnPrimaryHover }}
          onMouseLeave={e => { if (form.title.trim()) e.currentTarget.style.background = c.btnPrimary }}
        >
          {saving ? 'Saving…' : (initial?.id ? 'Update Blog' : 'Create Blog')}
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: '13px 24px', borderRadius: 10,
            border: `1.5px solid ${c.btnGhostBorder}`,
            background: c.btnGhost, color: c.btnGhostText,
            fontWeight: 600, fontSize: 14, cursor: 'pointer',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = c.green }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = c.btnGhostBorder }}
        >Cancel</button>
      </div>
    </div>
  )
}

// ─── Admin Page ───────────────────────────────────────────────────────────────
export default function AdminPage() {
  // Use the app's custom ThemeProvider (not next-themes) so theme is always correct
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const c = mounted && theme === 'light' ? light : dark

  const [authed, setAuthed] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [view, setView] = useState<'list' | 'new' | 'edit'>('list')
  const [editing, setEditing] = useState<Blog | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/blogs?admin=true')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((data: Blog[]) => { setBlogs(data); setAuthed(true) })
      .catch(() => setAuthed(false))
  }, [])

  async function login() {
    setLoginError('')
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      await loadBlogs()
      setAuthed(true)
    } else {
      setLoginError('Incorrect password. Please try again.')
    }
  }

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE' })
    setAuthed(false)
  }

  async function loadBlogs() {
    setLoading(true)
    const res = await fetch('/api/blogs?admin=true')
    const data = await res.json() as Blog[]
    setBlogs(data)
    setLoading(false)
  }

  async function saveBlog(form: BlogFormData) {
    setSaving(true)
    const method = editing?.id ? 'PUT' : 'POST'
    const url = editing?.id ? `/api/blogs/${editing.id}` : '/api/blogs'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      await loadBlogs()
      setView('list')
      setEditing(null)
    }
    setSaving(false)
  }

  async function togglePublish(blog: Blog) {
    await fetch(`/api/blogs/${blog.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...blog, published: !blog.published }),
    })
    await loadBlogs()
  }

  async function deleteBlog(id: string) {
    await fetch(`/api/blogs/${id}`, { method: 'DELETE' })
    setDeleteConfirm(null)
    await loadBlogs()
  }

  // ─── Loading splash ───────────────────────────────────────────────────────
  if (authed === null) {
    return (
      <div style={{
        minHeight: '100vh', background: c.bg, paddingTop: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            border: `3px solid ${c.border}`, borderTopColor: c.green,
            margin: '0 auto 16px',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ color: c.textMuted, fontSize: 14 }}>Loading…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // ─── Login ────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', background: c.bg, paddingTop: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Segoe UI', system-ui, sans-serif", padding: '80px 24px 48px',
      }}>
        <div style={{
          background: c.card, border: `1px solid ${c.border}`,
          borderRadius: 20, padding: '48px 40px',
          width: '100%', maxWidth: 420,
          boxShadow: c.shadow,
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{
              width: 60, height: 60, borderRadius: 16,
              background: c.surface, border: `1px solid ${c.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, margin: '0 auto 16px',
            }}>🌿</div>
            <h1 style={{ color: c.text, fontSize: 24, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.01em' }}>
              Blog Admin
            </h1>
            <p style={{ color: c.textSubtle, fontSize: 13, margin: 0 }}>hasnanenawaz.in</p>
          </div>

          {/* Password field */}
          <label style={{ color: c.textMuted, fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>
            Admin Password
          </label>
          <div style={{ position: 'relative', marginBottom: loginError ? 12 : 20 }}>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && login()}
              style={{
                width: '100%', padding: '13px 44px 13px 16px',
                borderRadius: 10, border: `1.5px solid ${loginError ? c.error : c.inputBorder}`,
                background: c.inputBg, color: c.text, fontSize: 15,
                outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => { if (!loginError) e.currentTarget.style.borderColor = c.inputFocus }}
              onBlur={e => { if (!loginError) e.currentTarget.style.borderColor = c.inputBorder }}
            />
            <button
              onClick={() => setShowPass(v => !v)}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: c.textSubtle, fontSize: 13, padding: 4,
              }}
              tabIndex={-1}
            >{showPass ? 'Hide' : 'Show'}</button>
          </div>

          {loginError && (
            <div style={{
              background: c.btnDanger, border: `1px solid ${c.error}`,
              borderRadius: 8, padding: '10px 14px', marginBottom: 16,
            }}>
              <p style={{ color: c.error, fontSize: 13, margin: 0, fontWeight: 500 }}>{loginError}</p>
            </div>
          )}

          <button
            onClick={login}
            style={{
              width: '100%', padding: '14px', borderRadius: 10, border: 'none',
              background: c.btnPrimary, color: c.btnPrimaryText,
              fontWeight: 700, fontSize: 15, cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = c.btnPrimaryHover }}
            onMouseLeave={e => { e.currentTarget.style.background = c.btnPrimary }}
          >
            Sign in →
          </button>
        </div>
      </div>
    )
  }

  // ─── Dashboard ────────────────────────────────────────────────────────────
  const published = blogs.filter(b => b.published).length
  const drafts = blogs.filter(b => !b.published).length

  return (
    <div style={{ minHeight: '100vh', background: c.bg, fontFamily: "'Segoe UI', system-ui, sans-serif", color: c.text }}>
      {/* Admin header — sits below the fixed global Navbar (64px) */}
      <div style={{ paddingTop: 64 }}>
        <div style={{
          background: c.card, borderBottom: `1px solid ${c.border}`,
          padding: '0 24px',
        }}>
          <div style={{
            maxWidth: 960, margin: '0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            height: 56,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>🌿</span>
              <div>
                <span style={{ fontWeight: 700, fontSize: 15, color: c.text }}>Blog Admin</span>
                {view !== 'list' && (
                  <button
                    onClick={() => { setView('list'); setEditing(null) }}
                    style={{ background: 'none', border: 'none', color: c.textSubtle, cursor: 'pointer', fontSize: 13, marginLeft: 12, padding: 0 }}
                  >
                    ← Back to list
                  </button>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <a
                href="/blog" target="_blank" rel="noopener noreferrer"
                style={{
                  color: c.textMuted, fontSize: 13, textDecoration: 'none',
                  padding: '6px 12px', borderRadius: 7,
                  border: `1px solid ${c.border}`,
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = c.green; e.currentTarget.style.color = c.greenText }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textMuted }}
              >
                View Blog ↗
              </a>
              <button
                onClick={logout}
                style={{
                  padding: '6px 14px', borderRadius: 7,
                  border: `1px solid ${c.border}`,
                  background: 'transparent', color: c.textSubtle,
                  cursor: 'pointer', fontSize: 13, fontWeight: 500,
                  transition: 'border-color 0.15s, color 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = c.error; e.currentTarget.style.color = c.error }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textSubtle }}
              >Sign out</button>
            </div>
          </div>
        </div>
      </div>

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '36px 24px 80px' }}>

        {/* ─── Form views ────────────────────────────────────────────────── */}
        {(view === 'new' || view === 'edit') && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ margin: 0, fontSize: 22, color: c.text, fontWeight: 800 }}>
                {view === 'edit' ? 'Edit Blog Post' : 'New Blog Post'}
              </h2>
              {view === 'edit' && editing && (
                <p style={{ color: c.textSubtle, fontSize: 13, margin: '4px 0 0' }}>
                  Editing: {editing.title}
                </p>
              )}
            </div>
            <div style={{
              background: c.card, border: `1px solid ${c.border}`,
              borderRadius: 16, padding: '32px 32px',
              boxShadow: c.shadow,
            }}>
              <BlogForm
                initial={editing}
                onSave={saveBlog}
                onCancel={() => { setView('list'); setEditing(null) }}
                saving={saving}
                c={c}
              />
            </div>
          </div>
        )}

        {/* ─── List view ─────────────────────────────────────────────────── */}
        {view === 'list' && (
          <div>
            {/* Page header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 22, color: c.text, fontWeight: 800 }}>Your Blog Posts</h2>
                {blogs.length > 0 && (
                  <p style={{ color: c.textSubtle, fontSize: 13, margin: '5px 0 0' }}>
                    <span style={{ color: c.pubText }}>{published} published</span>
                    {drafts > 0 && <span style={{ color: c.draftText }}> · {drafts} draft{drafts !== 1 ? 's' : ''}</span>}
                  </p>
                )}
              </div>
              <button
                onClick={() => { setEditing(null); setView('new') }}
                style={{
                  padding: '10px 20px', borderRadius: 10, border: 'none',
                  background: c.btnPrimary, color: c.btnPrimaryText,
                  fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                  transition: 'background 0.15s', flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = c.btnPrimaryHover }}
                onMouseLeave={e => { e.currentTarget.style.background = c.btnPrimary }}
              >
                <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New Post
              </button>
            </div>

            {/* Loading */}
            {loading && (
              <p style={{ color: c.textMuted, textAlign: 'center', padding: '40px 0' }}>Loading posts…</p>
            )}

            {/* Empty state */}
            {!loading && blogs.length === 0 && (
              <div style={{
                background: c.card, border: `2px dashed ${c.border}`,
                borderRadius: 16, padding: '64px 24px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
                <h3 style={{ color: c.text, fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>No posts yet</h3>
                <p style={{ color: c.textMuted, fontSize: 14, margin: '0 0 24px' }}>Create your first blog post to get started.</p>
                <button
                  onClick={() => { setEditing(null); setView('new') }}
                  style={{
                    padding: '12px 24px', borderRadius: 10, border: 'none',
                    background: c.btnPrimary, color: c.btnPrimaryText,
                    fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  }}
                >Write your first post →</button>
              </div>
            )}

            {/* Blog list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {blogs.map(blog => (
                <div
                  key={blog.id}
                  style={{
                    background: c.card, border: `1px solid ${c.border}`,
                    borderRadius: 14, padding: '20px 20px',
                    display: 'flex', gap: 16, alignItems: 'flex-start',
                    boxShadow: c.shadow,
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = c.borderStrong }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = c.border }}
                >
                  {/* Thumbnail */}
                  {blog.cover_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={blog.cover_image} alt=""
                      style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{
                      width: 80, height: 60, borderRadius: 8, background: c.placeholder,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22,
                    }}>📄</div>
                  )}

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                      <h3 style={{ margin: 0, fontSize: 15, color: c.text, fontWeight: 700, lineHeight: 1.3 }}>
                        {blog.title}
                      </h3>
                      <span style={{
                        padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                        background: blog.published ? c.pubBg : c.draftBg,
                        color: blog.published ? c.pubText : c.draftText,
                        border: `1px solid ${blog.published ? c.pubBorder : c.draftBorder}`,
                        flexShrink: 0,
                      }}>
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    {blog.excerpt && (
                      <p style={{ margin: '0 0 6px', color: c.textMuted, fontSize: 13, lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {blog.excerpt}
                      </p>
                    )}
                    <p style={{ margin: 0, color: c.textSubtle, fontSize: 12 }}>
                      Updated {new Date(blog.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 7, flexShrink: 0, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => togglePublish(blog)}
                      style={{
                        padding: '7px 12px', borderRadius: 7,
                        border: `1px solid ${c.btnGhostBorder}`,
                        background: 'transparent', color: c.btnGhostText,
                        cursor: 'pointer', fontSize: 12, fontWeight: 600,
                        transition: 'border-color 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = c.green }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = c.btnGhostBorder }}
                    >
                      {blog.published ? 'Unpublish' : 'Publish'}
                    </button>

                    {blog.published && (
                      <a
                        href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer"
                        style={{
                          padding: '7px 12px', borderRadius: 7,
                          border: `1px solid ${c.btnGhostBorder}`,
                          background: 'transparent', color: c.btnGhostText,
                          cursor: 'pointer', fontSize: 12, fontWeight: 600,
                          textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
                          transition: 'border-color 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = c.green }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = c.btnGhostBorder }}
                      >View ↗</a>
                    )}

                    <button
                      onClick={() => { setEditing(blog); setView('edit') }}
                      style={{
                        padding: '7px 14px', borderRadius: 7, border: 'none',
                        background: c.btnEdit, color: c.btnEditText,
                        cursor: 'pointer', fontSize: 12, fontWeight: 700,
                        transition: 'opacity 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                    >Edit</button>

                    <button
                      onClick={() => setDeleteConfirm(blog.id)}
                      style={{
                        padding: '7px 12px', borderRadius: 7, border: 'none',
                        background: c.btnDanger, color: c.btnDangerText,
                        cursor: 'pointer', fontSize: 12, fontWeight: 700,
                        transition: 'opacity 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                    >Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ─── Delete modal ────────────────────────────────────────────────── */}
      {deleteConfirm && (
        <div
          style={{
            position: 'fixed', inset: 0, background: c.overlay,
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
          }}
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            style={{
              background: c.card, border: `1px solid ${c.border}`,
              borderRadius: 18, padding: '40px 36px',
              maxWidth: 380, width: '90%', textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: 44, marginBottom: 14 }}>🗑️</div>
            <h3 style={{ color: c.text, margin: '0 0 10px', fontSize: 20, fontWeight: 800 }}>Delete this post?</h3>
            <p style={{ color: c.textMuted, fontSize: 14, margin: '0 0 28px', lineHeight: 1.5 }}>
              This action cannot be undone. The post will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  flex: 1, padding: '12px', borderRadius: 10,
                  border: `1.5px solid ${c.btnGhostBorder}`,
                  background: 'transparent', color: c.btnGhostText,
                  cursor: 'pointer', fontWeight: 600, fontSize: 14,
                }}
              >Cancel</button>
              <button
                onClick={() => deleteBlog(deleteConfirm)}
                style={{
                  flex: 1, padding: '12px', borderRadius: 10, border: 'none',
                  background: '#991b1b', color: '#fff',
                  cursor: 'pointer', fontWeight: 700, fontSize: 14,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#7f1d1d' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#991b1b' }}
              >Yes, delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
