'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Blog] page error:', error)
  }, [error])

  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0f0c',
      fontFamily: "'Segoe UI', Georgia, sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 24px',
    }}>
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <p style={{ fontSize: 48, margin: '0 0 16px' }}>🌿</p>
        <h1 style={{ color: '#e8f5e9', fontSize: 26, fontWeight: 800, margin: '0 0 12px' }}>
          Blog temporarily unavailable
        </h1>
        <p style={{ color: '#7ab893', fontSize: 15, margin: '0 0 32px', lineHeight: 1.6 }}>
          Something went wrong while loading this page. This is usually a temporary issue.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{
              padding: '12px 28px', borderRadius: 10, border: 'none',
              background: '#2e7d52', color: '#ffffff', fontWeight: 700,
              fontSize: 14, cursor: 'pointer',
            }}
          >
            Try again
          </button>
          <Link
            href="/"
            style={{
              padding: '12px 28px', borderRadius: 10,
              border: '1.5px solid #2e7d52', color: '#5cb87a',
              fontSize: 14, fontWeight: 600, textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  )
}
