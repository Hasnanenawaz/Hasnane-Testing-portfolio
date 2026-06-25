'use client'
import { useState, useRef } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface StatItem { fig: string; lab: string }
type BlockType = 'heading' | 'text' | 'statstrip' | 'bigstat' | 'compare' | 'local' | 'quote' | 'cta'

interface Block {
  id: string; type: BlockType
  kicker?: string; text?: string
  body?: string; lead?: boolean
  items?: StatItem[]
  fig?: string; lab?: string
  title?: string; sub?: string
  aLabel?: string; aValue?: number; bLabel?: string; bValue?: number
  head?: string; queries?: string[]; near?: string
  eyebrow?: string; heading?: string; btn?: string
}

interface Meta {
  category: string; date: string; read: string
  title: string; stand: string; author: string; role: string; contents: boolean
}

// ─── ID util ──────────────────────────────────────────────────────────────────
let _uid = 0
const nid = () => 'b' + (++_uid)

// ─── HTML helpers ─────────────────────────────────────────────────────────────
function esc(s: unknown) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
function bold(s: string) {
  return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}
function paras(s: string, lead?: boolean) {
  return (s || '').split(/\n\s*\n/).filter(p => p.trim()).map((p, i) =>
    `<p${lead && i === 0 ? ' class="lead"' : ''}>${bold(p).replace(/\n/g, '<br>')}</p>`
  ).join('\n')
}

function blockToHTML(b: Block, hr: { i: number }): string {
  switch (b.type) {
    case 'heading':
      hr.i++
      return `<h2 id="sec-${hr.i}">${b.kicker ? `<span class="kicker">${esc(b.kicker)}</span>` : ''}${esc(b.text)}</h2>`
    case 'text': return paras(b.body || '', b.lead)
    case 'quote': return `<blockquote class="pull">${esc(b.text)}</blockquote>`
    case 'statstrip': {
      const cells = (b.items || []).filter(it => it.fig || it.lab)
        .map(it => `<div class="s"><div class="fig">${esc(it.fig)}</div><div class="lab">${esc(it.lab)}</div></div>`).join('')
      return `<div class="statstrip">${cells}</div>`
    }
    case 'bigstat':
      return `<div class="stat-aside"><div class="fig">${esc(b.fig)}</div><div class="lab">${esc(b.lab)}</div></div>`
    case 'local': {
      const rows = (b.queries || []).filter(q => q.trim())
        .map(q => `<div class="searchrow"><span class="pin">&#9679;</span> ${esc(q)}<span class="near">${esc(b.near || 'near me')}</span></div>`).join('')
      return `<div class="localbox"><div class="l-head">${esc(b.head)}</div>${rows}</div>`
    }
    case 'compare': {
      const a = Math.max(0, Math.min(100, Number(b.aValue) || 0))
      const bv = Math.max(0, Math.min(a, Number(b.bValue) || 0))
      let cells = ''
      for (let i = 0; i < 100; i++) cells += `<div class="cell${i < bv ? ' mkt' : i < a ? ' pay' : ''}"></div>`
      return `<div class="thesis">${b.title ? `<p class="thesis-head">${esc(b.title)}</p>` : ''}${b.sub ? `<p class="thesis-sub">${esc(b.sub)}</p>` : ''}<div class="grid100">${cells}</div><div class="legend"><span><i class="ip"></i> <b>${a}</b> ${esc(b.aLabel)}</span><span><i class="im"></i> <b>${bv}</b> ${esc(b.bLabel)}</span></div></div>`
    }
    case 'cta':
      return `<div class="ctabox">${b.eyebrow ? `<p class="fc-eyebrow">${esc(b.eyebrow)}</p>` : ''}<h3>${esc(b.heading)}</h3>${b.text ? `<p>${esc(b.text)}</p>` : ''}${b.btn ? `<span class="fc-btn">${esc(b.btn)}</span>` : ''}</div>`
    default: return ''
  }
}

function buildArticleHTML(meta: Meta, blocks: Block[]): string {
  const hr = { i: 0 }
  const headings = blocks.filter(b => b.type === 'heading')
  let out = `<header class="post-head"><p class="eyebrow"><span>${esc(meta.category)}</span><span class="dot"></span><span class="muted">${esc(meta.date)}</span><span class="dot"></span><span class="muted">${esc(meta.read)}</span></p><h1>${esc(meta.title)}</h1>`
  if (meta.stand) out += `<p class="standfirst">${esc(meta.stand)}</p>`
  out += `<div class="byline"><div class="avatar">${esc((meta.author || '?')[0]?.toUpperCase() ?? '?')}</div><div><div class="who">${esc(meta.author)}</div><div class="role">${esc(meta.role)}</div></div></div></header>`
  if (meta.contents && headings.length >= 2) {
    let li = ''; let n = 0
    blocks.forEach(b => { if (b.type === 'heading') { n++; li += `<li><a href="#sec-${n}"><span class="n">${n}</span> ${esc(b.text)}</a></li>` } })
    out += `<nav class="contents"><h4>In this guide</h4><ol>${li}</ol></nav>`
  }
  blocks.forEach(b => { out += '\n' + blockToHTML(b, hr) })
  return `<div class="hn-article">\n${out}\n</div>`
}

// ─── Preview CSS (self-contained for iframe) ──────────────────────────────────
const PREVIEW_CSS = `@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Inter:wght@400;500;600;700&display=swap');
body{margin:0;background:#F4EEE2;padding:clamp(16px,4vw,36px)}
.hn-article{--paper:#F4EEE2;--paper-2:#EBE3D3;--rule:#D6CBB4;--ink:#262B20;--ink-soft:#5A6150;--forest:#2E4A33;--forest-deep:#1C2E20;--marigold:#BE862A;max-width:42rem;margin:0 auto;font-family:'Newsreader',Georgia,serif;color:var(--ink);font-size:1.18rem;line-height:1.72}
.hn-article p{margin:0 0 1.45rem}
.hn-article strong{font-weight:600;color:var(--forest)}
.hn-article .eyebrow{font-family:'Inter',sans-serif;font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--marigold);margin:0 0 18px;display:flex;gap:13px;align-items:center;flex-wrap:wrap}
.hn-article .eyebrow .dot{width:4px;height:4px;border-radius:50%;background:var(--rule)}
.hn-article .eyebrow .muted{color:var(--ink-soft)}
.hn-article h1{font-family:'Bricolage Grotesque',sans-serif;font-weight:700;color:var(--forest);font-size:clamp(2.1rem,5vw,3.3rem);line-height:1.05;letter-spacing:-.02em;margin:0 0 22px}
.hn-article .standfirst{font-size:clamp(1.15rem,2.2vw,1.38rem);line-height:1.55;color:var(--ink-soft);margin:0 0 28px}
.hn-article .byline{display:flex;align-items:center;gap:13px;padding-top:20px;border-top:1px solid var(--rule);margin-bottom:8px}
.hn-article .avatar{width:42px;height:42px;border-radius:50%;flex:0 0 auto;background:var(--forest);color:var(--paper);font-family:'Bricolage Grotesque',sans-serif;font-weight:600;font-size:17px;display:flex;align-items:center;justify-content:center}
.hn-article .byline .who{font-family:'Inter',sans-serif;font-size:14px;font-weight:600;color:var(--ink)}
.hn-article .byline .role{font-family:'Inter',sans-serif;font-size:12.5px;color:var(--ink-soft)}
.hn-article .contents{font-family:'Inter',sans-serif;background:var(--paper-2);border:1px solid var(--rule);border-radius:12px;padding:18px 22px;margin:30px 0}
.hn-article .contents h4{font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-soft);margin:0 0 12px}
.hn-article .contents ol{list-style:none;margin:0;padding:0}
.hn-article .contents li{margin:0 0 4px}
.hn-article .contents a{display:flex;gap:11px;align-items:baseline;text-decoration:none;color:var(--ink-soft);font-size:14px;padding:5px 0}
.hn-article .contents a:hover{color:var(--forest)}
.hn-article .contents .n{font-weight:700;color:var(--marigold);min-width:16px}
.hn-article .lead{font-size:1.3rem;line-height:1.6;color:var(--ink)}
.hn-article .lead::first-letter{font-family:'Bricolage Grotesque',sans-serif;font-weight:700;color:var(--forest);float:left;font-size:3.3em;line-height:.74;padding:6px 12px 0 0}
.hn-article h2{font-family:'Bricolage Grotesque',sans-serif;font-weight:600;color:var(--forest);font-size:clamp(1.5rem,3vw,1.95rem);line-height:1.12;letter-spacing:-.015em;margin:2.8rem 0 1.2rem;display:flex;flex-direction:column;gap:9px;scroll-margin-top:24px}
.hn-article h2 .kicker{font-family:'Inter',sans-serif;font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--marigold);display:inline-flex;align-items:center;gap:10px}
.hn-article h2 .kicker::before{content:'';width:24px;height:2px;background:var(--marigold);display:inline-block}
.hn-article .pull{font-style:italic;color:var(--forest);font-size:clamp(1.35rem,3vw,1.7rem);line-height:1.4;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);padding:1.5rem 0;margin:2.4rem 0}
.hn-article .thesis{background:var(--paper-2);border:1px solid var(--rule);border-radius:14px;padding:clamp(20px,3.5vw,32px);margin:2rem 0}
.hn-article .thesis-head{font-family:'Inter',sans-serif;font-size:12px;font-weight:600;letter-spacing:.13em;text-transform:uppercase;color:var(--ink-soft);margin:0 0 5px}
.hn-article .thesis-sub{font-size:1.03rem;margin:0 0 20px;max-width:30rem;line-height:1.5}
.hn-article .grid100{display:grid;grid-template-columns:repeat(20,1fr);gap:5px;max-width:420px}
.hn-article .cell{aspect-ratio:1;border-radius:2.5px;background:#E3DAC8}
.hn-article .cell.pay{background:var(--forest);opacity:.55}
.hn-article .cell.mkt{background:var(--marigold)}
.hn-article .legend{display:flex;gap:22px;flex-wrap:wrap;margin-top:18px;font-family:'Inter',sans-serif;font-size:13px;color:var(--ink-soft)}
.hn-article .legend span{display:inline-flex;align-items:center;gap:8px}
.hn-article .legend i{width:11px;height:11px;border-radius:3px;display:inline-block}
.hn-article .legend .ip{background:var(--forest);opacity:.55}
.hn-article .legend .im{background:var(--marigold)}
.hn-article .legend b{color:var(--ink);font-weight:600}
.hn-article .statstrip{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:1px;background:var(--rule);border:1px solid var(--rule);border-radius:12px;overflow:hidden;margin:2rem 0}
.hn-article .statstrip .s{background:var(--paper-2);padding:20px 18px}
.hn-article .statstrip .fig{font-family:'Bricolage Grotesque',sans-serif;font-weight:700;color:var(--marigold);font-size:clamp(1.6rem,4vw,2.1rem);line-height:1;letter-spacing:-.02em}
.hn-article .statstrip .lab{font-family:'Inter',sans-serif;font-size:12.5px;color:var(--ink-soft);line-height:1.35;margin-top:8px}
.hn-article .stat-aside{border-left:3px solid var(--marigold);padding:4px 0 4px 22px;margin:2rem 0}
.hn-article .stat-aside .fig{font-family:'Bricolage Grotesque',sans-serif;font-weight:700;color:var(--forest);font-size:clamp(2.1rem,5vw,2.8rem);line-height:1;letter-spacing:-.02em}
.hn-article .stat-aside .lab{font-family:'Inter',sans-serif;font-size:14px;color:var(--ink-soft);margin-top:8px;max-width:24rem;line-height:1.45}
.hn-article .localbox{background:var(--paper-2);border:1px solid var(--rule);border-radius:12px;padding:18px 20px;margin:2rem 0}
.hn-article .localbox .l-head{font-family:'Inter',sans-serif;font-size:11.5px;font-weight:600;letter-spacing:.13em;text-transform:uppercase;color:var(--ink-soft);margin-bottom:13px}
.hn-article .searchrow{display:flex;align-items:center;gap:11px;padding:11px 14px;margin-bottom:9px;background:var(--paper);border:1px solid var(--rule);border-radius:999px;font-family:'Inter',sans-serif;font-size:14.5px;color:var(--ink)}
.hn-article .searchrow:last-child{margin-bottom:0}
.hn-article .searchrow .pin{color:var(--marigold)}
.hn-article .searchrow .near{margin-left:auto;font-size:12px;color:var(--ink-soft);font-weight:500}
.hn-article .ctabox{background:var(--forest-deep);color:var(--paper);border-radius:14px;padding:clamp(28px,5vw,44px);margin:2.6rem 0}
.hn-article .ctabox .fc-eyebrow{font-family:'Inter',sans-serif;font-size:12px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:var(--marigold);margin:0 0 14px}
.hn-article .ctabox h3{font-family:'Bricolage Grotesque',sans-serif;font-weight:600;font-size:clamp(1.5rem,3.5vw,2.1rem);line-height:1.12;margin:0 0 14px;color:var(--paper)}
.hn-article .ctabox p{font-size:1.05rem;color:#CFD6C2;margin:0 0 22px;line-height:1.55}
.hn-article .ctabox .fc-btn{font-family:'Inter',sans-serif;font-size:14px;font-weight:600;background:var(--marigold);color:#241a06;border-radius:999px;padding:12px 22px;display:inline-block}
@media(max-width:540px){.hn-article .grid100{grid-template-columns:repeat(10,1fr)}.hn-article .lead::first-letter{font-size:2.8em}}`

// ─── Constants ────────────────────────────────────────────────────────────────
const S = {
  forest: '#2E4A33', forestDeep: '#1C2E20', marigold: '#BE862A',
  paper: '#F4EEE2', paper2: '#EBE3D3', rule: '#D6CBB4',
  ink: '#262B20', inkSoft: '#5A6150', white: '#ffffff',
}

const TYPE_LABELS: Record<BlockType, string> = {
  heading: 'Heading', text: 'Paragraph', statstrip: 'Stat strip',
  bigstat: 'Big stat', compare: 'Comparison grid', local: 'Local search box',
  quote: 'Pull quote', cta: 'Call to action',
}

const BLOCK_TEMPLATES: Record<BlockType, () => Block> = {
  heading: () => ({ id: nid(), type: 'heading', kicker: '', text: 'New section heading' }),
  text: () => ({ id: nid(), type: 'text', body: 'Write your paragraph here. Use **two stars** around words you want **emphasised**.', lead: false }),
  statstrip: () => ({ id: nid(), type: 'statstrip', items: [{ fig: '00%', lab: 'what this number means' }, { fig: '', lab: '' }, { fig: '', lab: '' }] }),
  bigstat: () => ({ id: nid(), type: 'bigstat', fig: '00%', lab: 'What this number means' }),
  compare: () => ({ id: nid(), type: 'compare', title: 'The gap', sub: 'A one-line setup for the comparison.', aLabel: 'first group', aValue: 90, bLabel: 'second group', bValue: 13 }),
  local: () => ({ id: nid(), type: 'local', head: 'What your customers are typing', queries: ['service in your city', 'another search query'], near: 'near me' }),
  quote: () => ({ id: nid(), type: 'quote', text: 'A short, memorable line worth pulling out.' }),
  cta: () => ({ id: nid(), type: 'cta', eyebrow: 'Next step', heading: 'A clear call to action.', text: 'One line on what they get.', btn: 'Button text' }),
}

const ADD_BLOCKS: { type: BlockType; label: string }[] = [
  { type: 'heading', label: '+ Heading' },
  { type: 'text', label: '+ Paragraph' },
  { type: 'statstrip', label: '+ Stat strip' },
  { type: 'bigstat', label: '+ Big stat' },
  { type: 'compare', label: '+ Comparison' },
  { type: 'local', label: '+ Local search' },
  { type: 'quote', label: '+ Pull quote' },
  { type: 'cta', label: '+ Call to action' },
]

// ─── Shared sub-components ────────────────────────────────────────────────────
function Fld({ label, value, onChange, rows, type }: {
  label: string; value: string; onChange: (v: string) => void
  rows?: number; type?: string
}) {
  const base = {
    width: '100%', padding: '7px 10px', borderRadius: 7,
    border: `1px solid ${S.rule}`, background: S.white,
    color: S.ink, fontSize: 13, fontFamily: 'inherit',
    lineHeight: '1.45', boxSizing: 'border-box' as const, outline: 'none',
  }
  return (
    <label style={{ display: 'block', marginBottom: 9 }}>
      <span style={{ display: 'block', fontSize: 11, fontWeight: 600, color: S.inkSoft, marginBottom: 4, letterSpacing: '.02em' }}>
        {label}
      </span>
      {rows
        ? <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} style={{ ...base, resize: 'vertical' }} />
        : <input type={type || 'text'} value={value} onChange={e => onChange(e.target.value)} style={base} />
      }
    </label>
  )
}

function IBtn({ label, onClick, disabled, danger }: {
  label: string; onClick: () => void; disabled?: boolean; danger?: boolean
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} style={{
      width: 26, height: 26, borderRadius: 6, border: `1px solid ${S.rule}`,
      background: S.paper, cursor: disabled ? 'not-allowed' : 'pointer',
      color: danger ? '#9b3d2e' : S.inkSoft, fontSize: 13,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: disabled ? 0.3 : 1, flexShrink: 0, fontFamily: 'inherit', lineHeight: '1',
    }}>
      {label}
    </button>
  )
}

// ─── Block card ────────────────────────────────────────────────────────────────
function BlockCard({ block, idx, total, onUpdate, onMove, onRemove }: {
  block: Block; idx: number; total: number
  onUpdate: (b: Block) => void; onMove: (dir: -1 | 1) => void; onRemove: () => void
}) {
  const u = (patch: Partial<Block>) => onUpdate({ ...block, ...patch })
  const items = block.items || [{ fig: '', lab: '' }, { fig: '', lab: '' }, { fig: '', lab: '' }]

  return (
    <div style={{ background: S.white, border: `1px solid ${S.rule}`, borderRadius: 11, padding: 14, marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: S.forest }}>
          {TYPE_LABELS[block.type]}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          <IBtn label="▲" onClick={() => onMove(-1)} disabled={idx === 0} />
          <IBtn label="▼" onClick={() => onMove(1)} disabled={idx === total - 1} />
          <IBtn label="✕" onClick={onRemove} danger />
        </div>
      </div>

      {block.type === 'heading' && (<>
        <Fld label="Kicker (small label above)" value={block.kicker || ''} onChange={v => u({ kicker: v })} />
        <Fld label="Heading text" value={block.text || ''} onChange={v => u({ text: v })} rows={2} />
      </>)}

      {block.type === 'text' && (<>
        <Fld label="Paragraph text (**word** = bold, blank line = new paragraph)" value={block.body || ''} onChange={v => u({ body: v })} rows={5} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: S.inkSoft, cursor: 'pointer', marginTop: 2 }}>
          <input type="checkbox" checked={!!block.lead} onChange={e => u({ lead: e.target.checked })} style={{ accentColor: S.marigold }} />
          Opening paragraph (drop cap)
        </label>
      </>)}

      {block.type === 'quote' && (
        <Fld label="Quote text" value={block.text || ''} onChange={v => u({ text: v })} rows={3} />
      )}

      {block.type === 'statstrip' && (<>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Fld label={`Figure ${i + 1}`} value={items[i]?.fig || ''} onChange={v => {
              const n = [...items]; if (!n[i]) n[i] = { fig: '', lab: '' }; n[i].fig = v; u({ items: n })
            }} />
            <Fld label={`Label ${i + 1}`} value={items[i]?.lab || ''} onChange={v => {
              const n = [...items]; if (!n[i]) n[i] = { fig: '', lab: '' }; n[i].lab = v; u({ items: n })
            }} />
          </div>
        ))}
        <p style={{ fontSize: 11, color: S.inkSoft, margin: '2px 0 0' }}>Leave a pair blank to drop that column. Up to 3.</p>
      </>)}

      {block.type === 'bigstat' && (<>
        <Fld label="Big figure" value={block.fig || ''} onChange={v => u({ fig: v })} />
        <Fld label="Label" value={block.lab || ''} onChange={v => u({ lab: v })} rows={2} />
      </>)}

      {block.type === 'compare' && (<>
        <Fld label="Box title" value={block.title || ''} onChange={v => u({ title: v })} />
        <Fld label="Box subtitle" value={block.sub || ''} onChange={v => u({ sub: v })} rows={2} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Fld label="Value A (0–100)" value={String(block.aValue ?? '')} onChange={v => u({ aValue: Number(v) })} type="number" />
          <Fld label="Label A" value={block.aLabel || ''} onChange={v => u({ aLabel: v })} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Fld label="Value B (0–100)" value={String(block.bValue ?? '')} onChange={v => u({ bValue: Number(v) })} type="number" />
          <Fld label="Label B" value={block.bLabel || ''} onChange={v => u({ bLabel: v })} />
        </div>
        <p style={{ fontSize: 11, color: S.inkSoft, margin: '2px 0 0' }}>A = larger group (green), B = subset (gold).</p>
      </>)}

      {block.type === 'local' && (<>
        <Fld label="Box heading" value={block.head || ''} onChange={v => u({ head: v })} />
        <Fld label="Search queries (one per line)" value={(block.queries || []).join('\n')} onChange={v => u({ queries: v.split('\n') })} rows={4} />
        <Fld label="Tag on the right" value={block.near || 'near me'} onChange={v => u({ near: v })} />
      </>)}

      {block.type === 'cta' && (<>
        <Fld label="Eyebrow" value={block.eyebrow || ''} onChange={v => u({ eyebrow: v })} />
        <Fld label="Heading" value={block.heading || ''} onChange={v => u({ heading: v })} rows={2} />
        <Fld label="Body text" value={block.text || ''} onChange={v => u({ text: v })} rows={2} />
        <Fld label="Button label" value={block.btn || ''} onChange={v => u({ btn: v })} />
      </>)}
    </div>
  )
}

// ─── Inner builder UI ─────────────────────────────────────────────────────────
function BuilderUI({ onChange }: { onChange: (html: string) => void }) {
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  const [meta, setMeta] = useState<Meta>({
    category: 'Guide', date: today, read: '5 min read',
    title: '', stand: '', author: 'Hasnane', role: 'Social Media Marketer', contents: true,
  })
  const [blocks, setBlocks] = useState<Block[]>([])
  const [showMeta, setShowMeta] = useState(true)
  const metaRef = useRef(meta)
  const blocksRef = useRef(blocks)
  metaRef.current = meta
  blocksRef.current = blocks

  function emit(m: Meta, bs: Block[]) { onChange(buildArticleHTML(m, bs)) }

  function updateMeta(patch: Partial<Meta>) {
    const next = { ...metaRef.current, ...patch }
    setMeta(next); emit(next, blocksRef.current)
  }
  function updateBlocks(next: Block[]) {
    setBlocks(next); emit(metaRef.current, next)
  }
  function addBlock(type: BlockType) { updateBlocks([...blocksRef.current, BLOCK_TEMPLATES[type]()]) }
  function moveBlock(idx: number, dir: -1 | 1) {
    const bs = [...blocksRef.current]
    const o = idx + dir;
    [bs[idx], bs[o]] = [bs[o], bs[idx]]
    updateBlocks(bs)
  }
  function removeBlock(idx: number) { updateBlocks(blocksRef.current.filter((_, i) => i !== idx)) }
  function updateBlock(idx: number, b: Block) {
    const bs = [...blocksRef.current]; bs[idx] = b; updateBlocks(bs)
  }

  const previewSrc = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${PREVIEW_CSS}</style></head><body>${buildArticleHTML(meta, blocks)}</body></html>`

  return (
    <div style={{ border: `1px solid ${S.rule}`, borderRadius: 11, overflow: 'hidden' }}>

      {/* Top bar */}
      <div style={{ background: S.forestDeep, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: S.paper, fontWeight: 600, fontSize: 13 }}>Blog Builder</span>
        <span style={{ color: '#A9B39C', fontSize: 11 }}>Preview updates as you type</span>
      </div>

      {/* Split panel */}
      <div style={{ display: 'flex', height: 660 }}>

        {/* Left: controls */}
        <div style={{ width: 370, flexShrink: 0, overflowY: 'auto', padding: 14, borderRight: `1px solid ${S.rule}`, background: S.paper }}>

          {/* Post header section */}
          <button type="button" onClick={() => setShowMeta(v => !v)} style={{
            width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0 10px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'inherit',
          }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: S.inkSoft }}>Post Header</span>
            <span style={{ fontSize: 11, color: S.inkSoft }}>{showMeta ? '▲' : '▼'}</span>
          </button>

          {showMeta && (
            <div style={{ background: '#fafaf8', border: `1px solid ${S.rule}`, borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <Fld label="Category" value={meta.category} onChange={v => updateMeta({ category: v })} />
                <Fld label="Date" value={meta.date} onChange={v => updateMeta({ date: v })} />
                <Fld label="Read time" value={meta.read} onChange={v => updateMeta({ read: v })} />
              </div>
              <Fld label="Article title (h1 in the post)" value={meta.title} onChange={v => updateMeta({ title: v })} rows={2} />
              <Fld label="Standfirst / intro summary" value={meta.stand} onChange={v => updateMeta({ stand: v })} rows={3} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Fld label="Author name" value={meta.author} onChange={v => updateMeta({ author: v })} />
                <Fld label="Author tagline" value={meta.role} onChange={v => updateMeta({ role: v })} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: S.inkSoft, cursor: 'pointer' }}>
                <input type="checkbox" checked={meta.contents} onChange={e => updateMeta({ contents: e.target.checked })} style={{ accentColor: S.marigold }} />
                Show &ldquo;In this guide&rdquo; list (needs 2+ headings)
              </label>
            </div>
          )}

          {/* Content blocks */}
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: S.inkSoft, marginBottom: 10 }}>
            Content Blocks
          </div>

          {blocks.length === 0 && (
            <div style={{ border: `2px dashed ${S.rule}`, borderRadius: 10, padding: '24px 16px', textAlign: 'center', color: S.inkSoft, fontSize: 13, marginBottom: 12 }}>
              Add your first block below
            </div>
          )}

          {blocks.map((b, idx) => (
            <BlockCard key={b.id} block={b} idx={idx} total={blocks.length}
              onUpdate={nb => updateBlock(idx, nb)}
              onMove={dir => moveBlock(idx, dir)}
              onRemove={() => removeBlock(idx)}
            />
          ))}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, paddingTop: 4 }}>
            {ADD_BLOCKS.map(({ type, label }) => (
              <button key={type} type="button" onClick={() => addBlock(type)} style={{
                fontSize: 12, fontWeight: 500, color: S.forest, background: S.paper2,
                border: `1px dashed ${S.rule}`, borderRadius: 999, padding: '7px 12px',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: live preview */}
        <div style={{ flex: 1, background: '#E4DBC9', overflow: 'hidden' }}>
          <iframe srcDoc={previewSrc} title="Blog preview" style={{ width: '100%', height: '100%', border: 0, display: 'block' }} />
        </div>
      </div>
    </div>
  )
}

// ─── Public component ─────────────────────────────────────────────────────────
export function BlogBuilder({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const [cleared, setCleared] = useState(false)
  const hasExisting = value.includes('hn-article')

  if (hasExisting && !cleared) {
    return (
      <div style={{ border: `1px solid ${S.rule}`, borderRadius: 11, overflow: 'hidden' }}>
        <div style={{ background: S.paper2, padding: '11px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: S.inkSoft }}>This post was built with the Blog Builder</span>
          <button type="button" onClick={() => { setCleared(true); onChange('') }} style={{
            fontSize: 12, fontWeight: 600, color: '#9b3d2e', background: 'none',
            border: '1px solid #fca5a5', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Clear &amp; rebuild
          </button>
        </div>
        <div dangerouslySetInnerHTML={{ __html: value }}
          style={{ padding: '24px 20px', background: S.paper, maxHeight: 420, overflowY: 'auto' }} />
      </div>
    )
  }

  return <BuilderUI onChange={onChange} />
}
