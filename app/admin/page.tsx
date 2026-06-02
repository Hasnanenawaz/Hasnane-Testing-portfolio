'use client'
import { useState, useEffect, useRef, ChangeEvent, DragEvent, KeyboardEvent } from 'react'
import type { Blog } from '@/lib/supabase'

// ─── Rich Text Editor ────────────────────────────────────────────────────────
function BlogEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <textarea
      value={value}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
      rows={16}
      placeholder="Write your blog content here... (Markdown or plain HTML supported)"
      style={{
        width: '100%', padding: '12px', borderRadius: '8px',
        border: '1.5px solid #2d4a3e', background: '#0f1f17',
        color: '#e8f5e9', fontSize: '14px', fontFamily: 'monospace',
        resize: 'vertical', lineHeight: 1.7, outline: 'none',
        boxSizing: 'border-box',
      }}
    />
  )
}

// ─── Image Uploader ──────────────────────────────────────────────────────────
function ImageUploader({ value, onChange }: { value: string; onChange: (v: string) => void }) {
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
        onClick={() => inputRef.current?.click()}
        onDragOver={(e: DragEvent) => e.preventDefault()}
        onDrop={(e: DragEvent) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
        style={{
          border: '2px dashed #3a6b4f', borderRadius: '10px', padding: '24px',
          textAlign: 'center', cursor: 'pointer', background: '#0f1f17',
          color: '#7ab893', fontSize: '14px', transition: 'border-color 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = '#5cb87a')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = '#3a6b4f')}
      >
        {uploading ? '⏳ Uploading...' : '📷 Click or drag to upload cover image'}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => handleFile(e.target.files?.[0])}
      />
      {error && <p style={{ color: '#ff6b6b', fontSize: '12px', marginTop: 4 }}>{error}</p>}
      {value && (
        <div style={{ marginTop: 12, position: 'relative' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Cover" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8 }} />
          <button
            onClick={() => onChange('')}
            style={{
              position: 'absolute', top: 8, right: 8, background: '#ff4444',
              border: 'none', color: '#fff', borderRadius: 4, padding: '4px 8px',
              cursor: 'pointer', fontSize: 12,
            }}
          >✕ Remove</button>
        </div>
      )}
    </div>
  )
}

// ─── Blog Form ───────────────────────────────────────────────────────────────
type BlogFormData = {
  title: string
  excerpt: string
  content: string
  cover_image: string
  published: boolean
  meta_title: string
  meta_description: string
}

const emptyForm: BlogFormData = {
  title: '', excerpt: '', content: '', cover_image: '',
  published: false, meta_title: '', meta_description: '',
}

function BlogForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: Blog | null
  onSave: (form: BlogFormData) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState<BlogFormData>(
    initial
      ? {
          title: initial.title,
          excerpt: initial.excerpt ?? '',
          content: initial.content ?? '',
          cover_image: initial.cover_image ?? '',
          published: initial.published,
          meta_title: initial.meta_title ?? '',
          meta_description: initial.meta_description ?? '',
        }
      : emptyForm
  )

  const set = <K extends keyof BlogFormData>(k: K, v: BlogFormData[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  const label: React.CSSProperties = { color: '#7ab893', fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }
  const input: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    border: '1.5px solid #2d4a3e', background: '#0f1f17',
    color: '#e8f5e9', fontSize: 14, outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label style={label}>Blog Title *</label>
        <input style={input} value={form.title} onChange={e => set('title', e.target.value)}
          placeholder="How Yoga Helps with PCOS..." />
      </div>
      <div>
        <label style={label}>Excerpt (shown on blog cards)</label>
        <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
          rows={3} placeholder="Short summary of the blog..."
          style={{ ...input, resize: 'vertical', fontFamily: 'inherit' }} />
      </div>
      <div>
        <label style={label}>Cover Image</label>
        <ImageUploader value={form.cover_image} onChange={v => set('cover_image', v)} />
      </div>
      <div>
        <label style={label}>Content</label>
        <BlogEditor value={form.content} onChange={v => set('content', v)} />
      </div>
      <div style={{ borderTop: '1px solid #1e3a2a', paddingTop: 20 }}>
        <p style={{ color: '#5cb87a', fontWeight: 700, fontSize: 13, marginBottom: 16 }}>🔍 SEO Settings</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={label}>Meta Title (defaults to blog title)</label>
            <input style={input} value={form.meta_title} onChange={e => set('meta_title', e.target.value)}
              placeholder="SEO optimized title..." />
          </div>
          <div>
            <label style={label}>Meta Description (defaults to excerpt)</label>
            <textarea value={form.meta_description} onChange={e => set('meta_description', e.target.value)}
              rows={3} placeholder="SEO meta description..."
              style={{ ...input, resize: 'vertical', fontFamily: 'inherit' }} />
          </div>
        </div>
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: '#e8f5e9' }}>
        <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)}
          style={{ width: 18, height: 18, accentColor: '#5cb87a' }} />
        Publish (visible on /blog)
      </label>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button
          onClick={() => onSave(form)}
          disabled={!form.title || saving}
          style={{
            flex: 1, padding: '14px', borderRadius: 10, border: 'none',
            background: form.title ? '#2e7d52' : '#1e3a2a',
            color: form.title ? '#fff' : '#4a7a5e', fontWeight: 700,
            fontSize: 15, cursor: form.title ? 'pointer' : 'not-allowed',
            transition: 'background 0.2s',
          }}
        >
          {saving ? '⏳ Saving...' : (initial?.id ? '💾 Update Blog' : '🚀 Create Blog')}
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: '14px 24px', borderRadius: 10, border: '1.5px solid #2d4a3e',
            background: 'transparent', color: '#7ab893', fontWeight: 600,
            fontSize: 14, cursor: 'pointer',
          }}
        >Cancel</button>
      </div>
    </div>
  )
}

// ─── Main Admin Page ─────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
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
      setLoginError('❌ Wrong password')
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

  const bg = '#071410'
  const card = '#0d1f18'
  const border = '#1a3328'
  const green = '#5cb87a'
  const text = '#e8f5e9'
  const muted = '#7ab893'

  if (authed === null) {
    return (
      <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: muted, fontSize: 16 }}>Loading...</p>
      </div>
    )
  }

  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', background: bg, display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', sans-serif",
      }}>
        <div style={{
          background: card, border: `1px solid ${border}`, borderRadius: 16,
          padding: '48px 40px', width: '100%', maxWidth: 400, textAlign: 'center',
        }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🌿</div>
          <h1 style={{ color: text, fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>Blog Admin</h1>
          <p style={{ color: muted, fontSize: 13, margin: '0 0 32px' }}>hasnanenawaz.in</p>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && login()}
            style={{
              width: '100%', padding: '13px 16px', borderRadius: 10,
              border: `1.5px solid ${border}`, background: bg,
              color: text, fontSize: 15, outline: 'none', boxSizing: 'border-box',
              marginBottom: 16,
            }}
          />
          {loginError && <p style={{ color: '#ff6b6b', fontSize: 13, marginBottom: 12 }}>{loginError}</p>}
          <button
            onClick={login}
            style={{
              width: '100%', padding: '13px', borderRadius: 10, border: 'none',
              background: '#2e7d52', color: '#fff', fontWeight: 700,
              fontSize: 15, cursor: 'pointer',
            }}
          >Login →</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Segoe UI', sans-serif", color: text }}>
      <header style={{
        background: card, borderBottom: `1px solid ${border}`,
        padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 22 }}>🌿</span>
          <div>
            <span style={{ fontWeight: 700, fontSize: 16, color: text }}>Blog Admin</span>
            <span style={{ fontSize: 12, color: muted, display: 'block' }}>hasnanenawaz.in</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/blog" target="_blank" rel="noopener noreferrer"
            style={{ color: muted, fontSize: 13, textDecoration: 'none' }}>
            View Live Blog ↗
          </a>
          <button
            onClick={logout}
            style={{
              padding: '8px 16px', borderRadius: 8, border: `1px solid ${border}`,
              background: 'transparent', color: muted, cursor: 'pointer', fontSize: 13,
            }}
          >Logout</button>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        {(view === 'new' || view === 'edit') && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
              <button
                onClick={() => { setView('list'); setEditing(null) }}
                style={{ background: 'none', border: 'none', color: muted, cursor: 'pointer', fontSize: 20 }}
              >←</button>
              <h2 style={{ margin: 0, fontSize: 22, color: text }}>
                {view === 'edit' ? '✏️ Edit Blog' : '✍️ New Blog'}
              </h2>
            </div>
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 32 }}>
              <BlogForm
                initial={editing}
                onSave={saveBlog}
                onCancel={() => { setView('list'); setEditing(null) }}
                saving={saving}
              />
            </div>
          </div>
        )}

        {view === 'list' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h2 style={{ margin: 0, fontSize: 22, color: text }}>Your Blogs</h2>
              <button
                onClick={() => { setEditing(null); setView('new') }}
                style={{
                  padding: '11px 22px', borderRadius: 10, border: 'none',
                  background: '#2e7d52', color: '#fff', fontWeight: 700,
                  fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                }}
              >+ New Blog</button>
            </div>

            {loading && <p style={{ color: muted, textAlign: 'center' }}>Loading blogs...</p>}
            {!loading && blogs.length === 0 && (
              <div style={{
                background: card, border: `1px dashed ${border}`, borderRadius: 16,
                padding: '60px 24px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
                <p style={{ color: muted, fontSize: 16 }}>No blogs yet. Create your first one!</p>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {blogs.map(blog => (
                <div key={blog.id} style={{
                  background: card, border: `1px solid ${border}`, borderRadius: 14,
                  padding: 24, display: 'flex', gap: 20, alignItems: 'flex-start',
                }}>
                  {blog.cover_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={blog.cover_image} alt=""
                      style={{ width: 90, height: 70, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                  ) : (
                    <div style={{
                      width: 90, height: 70, borderRadius: 8, background: '#1a3328',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <span style={{ fontSize: 24 }}>📄</span>
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <h3 style={{ margin: 0, fontSize: 16, color: text, fontWeight: 600 }}>{blog.title}</h3>
                      <span style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                        background: blog.published ? '#1a4a2e' : '#2a1a0a',
                        color: blog.published ? '#5cb87a' : '#d4873a',
                        border: `1px solid ${blog.published ? '#2e7d52' : '#7a4a1a'}`,
                      }}>
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    {blog.excerpt && (
                      <p style={{ margin: '0 0 10px', color: muted, fontSize: 13, lineHeight: 1.5 }}>{blog.excerpt}</p>
                    )}
                    <p style={{ margin: 0, color: '#4a7a5e', fontSize: 12 }}>
                      Updated {new Date(blog.updated_at).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => togglePublish(blog)}
                      style={{
                        padding: '8px 14px', borderRadius: 8, border: `1px solid ${border}`,
                        background: 'transparent', color: muted, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                      }}
                    >
                      {blog.published ? 'Unpublish' : 'Publish'}
                    </button>
                    {blog.published && (
                      <a
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '8px 14px', borderRadius: 8, border: `1px solid ${border}`,
                          background: 'transparent', color: muted, cursor: 'pointer', fontSize: 12,
                          fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center',
                        }}
                      >View ↗</a>
                    )}
                    <button
                      onClick={() => { setEditing(blog); setView('edit') }}
                      style={{
                        padding: '8px 16px', borderRadius: 8, border: 'none',
                        background: '#1e4a35', color: green, cursor: 'pointer', fontSize: 12, fontWeight: 700,
                      }}
                    >Edit</button>
                    <button
                      onClick={() => setDeleteConfirm(blog.id)}
                      style={{
                        padding: '8px 14px', borderRadius: 8, border: 'none',
                        background: '#2a1010', color: '#e05252', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                      }}
                    >Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }}>
          <div style={{
            background: card, border: `1px solid ${border}`, borderRadius: 16,
            padding: 36, maxWidth: 380, width: '90%', textAlign: 'center',
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ color: text, margin: '0 0 8px' }}>Delete Blog?</h3>
            <p style={{ color: muted, fontSize: 14, margin: '0 0 28px' }}>This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  flex: 1, padding: '12px', borderRadius: 10, border: `1px solid ${border}`,
                  background: 'transparent', color: muted, cursor: 'pointer', fontWeight: 600,
                }}
              >Cancel</button>
              <button
                onClick={() => deleteBlog(deleteConfirm)}
                style={{
                  flex: 1, padding: '12px', borderRadius: 10, border: 'none',
                  background: '#7a1a1a', color: '#fff', cursor: 'pointer', fontWeight: 700,
                }}
              >Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
