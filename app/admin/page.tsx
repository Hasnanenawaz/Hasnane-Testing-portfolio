'use client'
import { useState, useEffect, useRef, ChangeEvent, DragEvent, KeyboardEvent } from 'react'
import type { Blog } from '@/lib/supabase'

// ─── Design tokens (always light / cream — no dark mode in admin) ────────────
const c = {
  pageBg:          '#f5f0e8',
  headerBg:        '#1e3a24',
  headerText:      '#ffffff',
  headerMuted:     'rgba(255,255,255,0.6)',
  cardBg:          '#ffffff',
  cardBorder:      '#e8e3d8',
  text:            '#1a1a14',
  muted:           '#5a5e52',
  subtle:          '#9a9d8e',
  green:           '#1e3a24',
  inputBg:         '#ffffff',
  inputBorder:     '#d4cdb8',
  inputFocus:      '#1e3a24',
  pubBg:           '#dcf0e0',
  pubText:         '#1a5c30',
  pubBorder:       '#a8d8b8',
  draftBg:         '#fef9ec',
  draftText:       '#855a12',
  draftBorder:     '#f5d88a',
  btnPrimary:      '#1e3a24',
  btnPrimaryHover: '#162d1c',
  btnPrimaryText:  '#ffffff',
  btnGhostBorder:  '#d4cdb8',
  btnGhostText:    '#3a3d34',
  btnEdit:         '#1e3a24',
  btnEditText:     '#ffffff',
  btnDelete:       '#fff2f2',
  btnDeleteText:   '#c02828',
  btnDeleteBorder: '#fca5a5',
  error:           '#c02828',
  divider:         '#e8e3d8',
  shadow:          '0 1px 3px rgba(0,0,0,0.07)',
  shadowMd:        '0 2px 14px rgba(0,0,0,0.09)',
}

const inp: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 8,
  border: `1.5px solid ${c.inputBorder}`, background: c.inputBg,
  color: c.text, fontSize: 14, outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit', transition: 'border-color 0.15s',
}
const lbl: React.CSSProperties = {
  color: c.muted, fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6,
}

function onFocusIn(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = c.inputFocus
}
function onFocusOut(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = c.inputBorder
}

// ─── Image uploader ──────────────────────────────────────────────────────────
function ImageUploader({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File | null | undefined) {
    if (!file) return
    setUploading(true); setError('')
    const fd = new FormData(); fd.append('image', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json() as { url?: string; error?: string }
      if (data.url) onChange(data.url)
      else setError(data.error ?? 'Upload failed')
    } catch { setError('Upload failed') }
    finally { setUploading(false) }
  }

  if (value) {
    return (
      <div>
        <div style={{
          border: `1.5px solid ${c.cardBorder}`, borderRadius: 10,
          overflow: 'hidden', position: 'relative',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Cover" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', display: 'block' }} />
          <div style={{
            padding: '10px 14px', background: '#fafaf8',
            borderTop: `1px solid ${c.cardBorder}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 12, color: c.muted }}>Cover image · First image appears on blog cards.</span>
            <button
              onClick={() => onChange('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.btnDeleteText, fontSize: 13, fontWeight: 600, padding: '4px 8px' }}
            >Remove</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div
        role="button" tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e: DragEvent<HTMLDivElement>) => e.preventDefault()}
        onDrop={(e: DragEvent<HTMLDivElement>) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
        style={{
          border: `2px dashed ${c.inputBorder}`, borderRadius: 10,
          padding: '28px 16px', textAlign: 'center', cursor: 'pointer',
          background: '#fafaf8', color: c.muted, fontSize: 14,
          transition: 'border-color 0.15s, background 0.15s', outline: 'none',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = c.green; e.currentTarget.style.background = '#f0ece4' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = c.inputBorder; e.currentTarget.style.background = '#fafaf8' }}
      >
        <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.5 }}>⬆</div>
        {uploading ? 'Uploading…' : 'Click or drag to upload cover image'}
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFile(e.target.files?.[0])} />
      {error && <p style={{ color: c.error, fontSize: 12, marginTop: 6 }}>{error}</p>}
    </div>
  )
}

// ─── Blog form ───────────────────────────────────────────────────────────────
type BlogFormData = {
  title: string; excerpt: string; content: string; cover_image: string
  published: boolean; meta_title: string; meta_description: string
}

const emptyForm: BlogFormData = {
  title: '', excerpt: '', content: '', cover_image: '',
  published: false, meta_title: '', meta_description: '',
}

function BlogForm({ initial, onSave, onCancel, saving }: {
  initial: Blog | null; onSave: (f: BlogFormData) => void
  onCancel: () => void; saving: boolean
}) {
  const [form, setForm] = useState<BlogFormData>(
    initial ? {
      title: initial.title, excerpt: initial.excerpt ?? '',
      content: initial.content ?? '', cover_image: initial.cover_image ?? '',
      published: initial.published, meta_title: initial.meta_title ?? '',
      meta_description: initial.meta_description ?? '',
    } : emptyForm
  )
  const set = <K extends keyof BlogFormData>(k: K, v: BlogFormData[K]) =>
    setForm(f => ({ ...f, [k]: v }))
  const canSave = form.title.trim() && !saving

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Blog content card ── */}
      <div style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: 16, padding: '28px 28px 24px', boxShadow: c.shadow }}>
        <h2 style={{ color: c.text, fontSize: 17, fontWeight: 700, margin: '0 0 22px' }}>Blog content</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={lbl}>Title *</label>
            <input style={inp} value={form.title} onFocus={onFocusIn} onBlur={onFocusOut}
              onChange={(e: ChangeEvent<HTMLInputElement>) => set('title', e.target.value)}
              placeholder="Enter blog title…" />
          </div>

          <div>
            <label style={lbl}>Excerpt</label>
            <textarea rows={3} value={form.excerpt} onFocus={onFocusIn} onBlur={onFocusOut}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => set('excerpt', e.target.value)}
              placeholder="Short summary shown on blog cards…"
              style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} />
          </div>

          <div>
            <label style={lbl}>Content</label>
            <textarea rows={16} value={form.content} onFocus={onFocusIn} onBlur={onFocusOut}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => set('content', e.target.value)}
              placeholder="Write your blog post here…"
              style={{ ...inp, resize: 'vertical', lineHeight: 1.8, fontFamily: 'inherit' }} />
          </div>

          <div>
            <label style={lbl}>Images</label>
            <p style={{ color: c.subtle, fontSize: 12, margin: '0 0 10px' }}>
              First image appears on blog cards.
            </p>
            <ImageUploader value={form.cover_image} onChange={v => set('cover_image', v)} />
          </div>
        </div>
      </div>

      {/* ── SEO card ── */}
      <div style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: 16, padding: '28px 28px 24px', boxShadow: c.shadow }}>
        <h2 style={{ color: c.text, fontSize: 17, fontWeight: 700, margin: '0 0 22px' }}>SEO</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={lbl}>Meta title</label>
            <input style={inp} value={form.meta_title} onFocus={onFocusIn} onBlur={onFocusOut}
              onChange={(e: ChangeEvent<HTMLInputElement>) => set('meta_title', e.target.value)}
              placeholder="Defaults to blog title" />
          </div>

          <div>
            <label style={lbl}>Meta description</label>
            <textarea rows={3} value={form.meta_description} onFocus={onFocusIn} onBlur={onFocusOut}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => set('meta_description', e.target.value)}
              placeholder="Defaults to excerpt"
              style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
            <input type="checkbox" checked={form.published}
              onChange={(e: ChangeEvent<HTMLInputElement>) => set('published', e.target.checked)}
              style={{ width: 17, height: 17, accentColor: c.green, cursor: 'pointer' }} />
            <span style={{ color: c.text, fontSize: 14 }}>Publish (visible on /blog)</span>
          </label>
        </div>
      </div>

      {/* ── Actions ── */}
      <div style={{ display: 'flex', gap: 12, paddingBottom: 40 }}>
        <button onClick={onCancel}
          style={{
            padding: '12px 24px', borderRadius: 10, border: `1.5px solid ${c.btnGhostBorder}`,
            background: 'transparent', color: c.btnGhostText, fontWeight: 600,
            fontSize: 14, cursor: 'pointer',
          }}>
          Cancel
        </button>
        <button onClick={() => onSave(form)} disabled={!canSave}
          style={{
            padding: '12px 28px', borderRadius: 10, border: 'none',
            background: canSave ? c.btnPrimary : '#ccc',
            color: c.btnPrimaryText, fontWeight: 700, fontSize: 14,
            cursor: canSave ? 'pointer' : 'not-allowed',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { if (canSave) e.currentTarget.style.background = c.btnPrimaryHover }}
          onMouseLeave={e => { if (canSave) e.currentTarget.style.background = c.btnPrimary }}>
          {saving ? 'Saving…' : (initial?.id ? 'Update blog' : 'Create blog')}
        </button>
      </div>
    </div>
  )
}

// ─── Admin page ──────────────────────────────────────────────────────────────
export default function AdminPage() {
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
      .then((d: Blog[]) => { setBlogs(d); setAuthed(true) })
      .catch(() => setAuthed(false))
  }, [])

  async function login() {
    setLoginError('')
    const res = await fetch('/api/auth', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) { await loadBlogs(); setAuthed(true) }
    else setLoginError('Incorrect password. Please try again.')
  }

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE' })
    setAuthed(false)
  }

  async function loadBlogs() {
    setLoading(true)
    const res = await fetch('/api/blogs?admin=true')
    setBlogs(await res.json() as Blog[])
    setLoading(false)
  }

  async function saveBlog(form: BlogFormData) {
    setSaving(true)
    const method = editing?.id ? 'PUT' : 'POST'
    const url = editing?.id ? `/api/blogs/${editing.id}` : '/api/blogs'
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) { await loadBlogs(); setView('list'); setEditing(null) }
    setSaving(false)
  }

  async function togglePublish(blog: Blog) {
    await fetch(`/api/blogs/${blog.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...blog, published: !blog.published }),
    })
    await loadBlogs()
  }

  async function deleteBlog(id: string) {
    await fetch(`/api/blogs/${id}`, { method: 'DELETE' })
    setDeleteConfirm(null)
    await loadBlogs()
  }

  // Shell: fixed overlay covers global Navbar (zIndex must exceed navbar z-50=50)
  const shell: React.CSSProperties = {
    position: 'fixed', inset: 0, zIndex: 9999,
    overflowY: 'auto', background: c.pageBg,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    colorScheme: 'light',
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (authed === null) {
    return (
      <div style={shell}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <p style={{ color: c.muted, fontSize: 15 }}>Loading…</p>
        </div>
      </div>
    )
  }

  // ── Login ──────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ ...shell, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{
          background: c.cardBg, border: `1px solid ${c.cardBorder}`,
          borderRadius: 20, padding: '48px 40px', width: '100%', maxWidth: 420,
          boxShadow: c.shadowMd,
        }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14, background: c.pageBg,
              border: `1px solid ${c.cardBorder}`, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 26, margin: '0 auto 16px',
            }}>🌿</div>
            <h1 style={{ color: c.text, fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>Blog Admin</h1>
            <p style={{ color: c.subtle, fontSize: 13, margin: 0 }}>hasnanenawaz.in</p>
          </div>

          <label style={{ ...lbl, marginBottom: 7 }}>Password</label>
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Enter admin password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && login()}
              onFocus={e => e.currentTarget.style.borderColor = c.inputFocus}
              onBlur={e => e.currentTarget.style.borderColor = loginError ? c.error : c.inputBorder}
              style={{ ...inp, paddingRight: 52, borderColor: loginError ? c.error : c.inputBorder }}
            />
            <button onClick={() => setShowPass(v => !v)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: c.subtle, fontSize: 12, fontWeight: 600 }}
              tabIndex={-1}>{showPass ? 'Hide' : 'Show'}</button>
          </div>

          {loginError && (
            <p style={{ color: c.error, fontSize: 13, marginBottom: 14, textAlign: 'center' }}>{loginError}</p>
          )}

          <button onClick={login}
            style={{
              width: '100%', padding: '13px', borderRadius: 10, border: 'none',
              background: c.btnPrimary, color: c.btnPrimaryText,
              fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = c.btnPrimaryHover }}
            onMouseLeave={e => { e.currentTarget.style.background = c.btnPrimary }}>
            Sign in →
          </button>
        </div>
      </div>
    )
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────
  return (
    <div style={shell}>

      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: c.headerBg, padding: '0 28px',
      }}>
        <div style={{
          maxWidth: 1000, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 56,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, opacity: 0.7 }}>
              {[0,1,2,3].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: 1, background: c.headerText }} />)}
            </div>
            <span style={{ color: c.headerText, fontWeight: 700, fontSize: 15 }}>Blog Admin</span>
            <span style={{ color: c.headerMuted, fontSize: 13 }}>hasnanenawaz.in</span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {view === 'list' ? (
              <button onClick={() => { setEditing(null); setView('new') }}
                style={{
                  padding: '7px 16px', borderRadius: 8,
                  border: `1.5px solid rgba(255,255,255,0.4)`,
                  background: 'transparent', color: c.headerText,
                  fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                + New blog
              </button>
            ) : (
              <button onClick={() => { setView('list'); setEditing(null) }}
                style={{
                  padding: '7px 16px', borderRadius: 8,
                  border: `1.5px solid rgba(255,255,255,0.4)`,
                  background: 'transparent', color: c.headerText,
                  fontWeight: 700, fontSize: 13, cursor: 'pointer',
                }}>
                ← All blogs
              </button>
            )}
            <button onClick={logout}
              style={{
                padding: '7px 16px', borderRadius: 8,
                border: `1.5px solid rgba(255,255,255,0.25)`,
                background: 'transparent', color: c.headerMuted,
                fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}>
              ↪ Log out
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* ── Form views ── */}
        {(view === 'new' || view === 'edit') && (
          <div>
            <h1 style={{ color: c.text, fontSize: 24, fontWeight: 800, margin: '0 0 28px' }}>
              {view === 'edit' ? 'Edit blog' : 'New blog'}
            </h1>
            <BlogForm
              initial={editing}
              onSave={saveBlog}
              onCancel={() => { setView('list'); setEditing(null) }}
              saving={saving}
            />
          </div>
        )}

        {/* ── List view ── */}
        {view === 'list' && (
          <div>
            <h1 style={{ color: c.text, fontSize: 24, fontWeight: 800, margin: '0 0 24px' }}>
              Your blogs
            </h1>

            {loading && (
              <p style={{ color: c.muted, padding: '40px 0', textAlign: 'center' }}>Loading…</p>
            )}

            {!loading && blogs.length === 0 && (
              <div style={{
                background: c.cardBg, border: `2px dashed ${c.cardBorder}`,
                borderRadius: 16, padding: '64px 24px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 44, marginBottom: 14 }}>📝</div>
                <p style={{ color: c.muted, fontSize: 16, marginBottom: 20 }}>No blogs yet.</p>
                <button onClick={() => { setEditing(null); setView('new') }}
                  style={{
                    padding: '11px 24px', borderRadius: 10, border: 'none',
                    background: c.btnPrimary, color: c.btnPrimaryText,
                    fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  }}>
                  Write your first post →
                </button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {blogs.map(blog => (
                <div key={blog.id} style={{
                  background: c.cardBg, border: `1px solid ${c.cardBorder}`,
                  borderRadius: 14, padding: '20px 20px 0', boxShadow: c.shadow,
                }}>
                  {/* Card top: thumbnail + content */}
                  <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>

                    {/* Thumbnail */}
                    {blog.cover_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={blog.cover_image} alt=""
                        style={{ width: 130, height: 100, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                    ) : (
                      <div style={{
                        width: 130, height: 100, borderRadius: 8, background: '#f0ece4',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, fontSize: 28, color: '#bbb',
                      }}>📄</div>
                    )}

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: c.text, lineHeight: 1.35, flex: 1 }}>
                          {blog.title}
                        </h3>
                        <span style={{
                          padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                          flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 4,
                          background: blog.published ? c.pubBg : c.draftBg,
                          color: blog.published ? c.pubText : c.draftText,
                          border: `1px solid ${blog.published ? c.pubBorder : c.draftBorder}`,
                        }}>
                          {blog.published ? '◉' : '○'} {blog.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      {blog.excerpt && (
                        <p style={{
                          margin: '0 0 6px', color: c.muted, fontSize: 13, lineHeight: 1.55,
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                          {blog.excerpt}
                        </p>
                      )}
                      <p style={{ margin: 0, color: c.subtle, fontSize: 12 }}>
                        {new Date(blog.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Action row */}
                  <div style={{
                    borderTop: `1px solid ${c.divider}`, padding: '12px 0',
                    display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center',
                  }}>
                    <button onClick={() => togglePublish(blog)}
                      style={{
                        padding: '7px 14px', borderRadius: 8,
                        border: `1.5px solid ${c.btnGhostBorder}`,
                        background: 'transparent', color: c.btnGhostText,
                        cursor: 'pointer', fontSize: 12, fontWeight: 600,
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                      }}>
                      <span style={{ fontSize: 13 }}>{blog.published ? '⊘' : '◉'}</span>
                      {blog.published ? 'Unpublish' : 'Publish'}
                    </button>

                    {blog.published && (
                      <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer"
                        style={{
                          padding: '7px 14px', borderRadius: 8,
                          border: `1.5px solid ${c.btnGhostBorder}`,
                          background: 'transparent', color: c.btnGhostText,
                          cursor: 'pointer', fontSize: 12, fontWeight: 600,
                          textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5,
                        }}>
                        <span style={{ fontSize: 13 }}>↗</span> View live
                      </a>
                    )}

                    <button onClick={() => { setEditing(blog); setView('edit') }}
                      style={{
                        padding: '7px 16px', borderRadius: 8, border: 'none',
                        background: c.btnEdit, color: c.btnEditText,
                        cursor: 'pointer', fontSize: 12, fontWeight: 700,
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                      }}>
                      <span style={{ fontSize: 13 }}>✎</span> Edit
                    </button>

                    <button onClick={() => setDeleteConfirm(blog.id)}
                      style={{
                        padding: '7px 14px', borderRadius: 8,
                        border: `1.5px solid ${c.btnDeleteBorder}`,
                        background: c.btnDelete, color: c.btnDeleteText,
                        cursor: 'pointer', fontSize: 12, fontWeight: 700,
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                      }}>
                      <span style={{ fontSize: 13 }}>🗑</span> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 80,
          }}
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            style={{
              background: c.cardBg, border: `1px solid ${c.cardBorder}`,
              borderRadius: 18, padding: '40px 36px',
              maxWidth: 380, width: '90%', textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: 40, marginBottom: 14 }}>🗑️</div>
            <h3 style={{ color: c.text, margin: '0 0 8px', fontSize: 19, fontWeight: 800 }}>Delete this post?</h3>
            <p style={{ color: c.muted, fontSize: 14, margin: '0 0 28px', lineHeight: 1.5 }}>
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setDeleteConfirm(null)}
                style={{
                  flex: 1, padding: '12px', borderRadius: 10,
                  border: `1.5px solid ${c.btnGhostBorder}`,
                  background: 'transparent', color: c.btnGhostText,
                  cursor: 'pointer', fontWeight: 600, fontSize: 14,
                }}>Cancel</button>
              <button onClick={() => deleteBlog(deleteConfirm)}
                style={{
                  flex: 1, padding: '12px', borderRadius: 10, border: 'none',
                  background: '#991b1b', color: '#fff',
                  cursor: 'pointer', fontWeight: 700, fontSize: 14,
                }}>Yes, delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
