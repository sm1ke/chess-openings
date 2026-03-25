import { useState, useRef } from 'react'
import { Modal } from './Modal'
import { parsePgn } from '../utils/parsePgn'
import { useStore } from '../store/useStore'
import type { Tag } from '../types'

interface Props {
  onClose: () => void
}

const ALL_TAGS: Tag[] = ['standard', 'gambit', 'trick', 'system']

export function ImportModal({ onClose }: Props) {
  const addOpening = useStore((s) => s.addOpening)
  const [pgn, setPgn] = useState('')
  const [color, setColor] = useState<'white' | 'black'>('white')
  const [tags, setTags] = useState<Tag[]>([])
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function toggleTag(t: Tag) {
    setTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPgn(ev.target?.result as string ?? '')
    reader.readAsText(file)
  }

  async function handleImport() {
    setError('')
    const openings = parsePgn(pgn, { color, tags })
    if (openings.length === 0) {
      setError('No valid openings found. Check your PGN.')
      return
    }
    for (const o of openings) {
      await addOpening(o)
    }
    onClose()
  }

  const btn: React.CSSProperties = {
    border: 'none', borderRadius: 4, cursor: 'pointer', padding: '6px 14px', fontSize: 13,
  }

  return (
    <Modal title="Import Opening" onClose={onClose}>
      <div className="flex flex-col gap-3">
        {/* Color */}
        <div className="flex gap-2">
          {(['white', 'black'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              style={{
                ...btn,
                background: color === c ? 'var(--chess-accent)' : 'var(--chess-border)',
                color: color === c ? '#fff' : 'var(--chess-text)',
                flex: 1,
              }}
            >
              {c === 'white' ? '⬜ White' : '⬛ Black'}
            </button>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map((t) => (
            <button
              key={t}
              onClick={() => toggleTag(t)}
              style={{
                ...btn,
                background: tags.includes(t) ? 'var(--chess-accent)' : 'var(--chess-border)',
                color: tags.includes(t) ? '#fff' : 'var(--chess-text)',
                textTransform: 'capitalize',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* PGN textarea */}
        <textarea
          rows={8}
          placeholder="Paste PGN here…"
          value={pgn}
          onChange={(e) => setPgn(e.target.value)}
          style={{
            background: 'var(--chess-bg)', color: 'var(--chess-text)',
            border: '1px solid var(--chess-border)', borderRadius: 4,
            padding: 8, fontFamily: 'monospace', fontSize: 12, resize: 'vertical',
          }}
        />

        {/* File upload */}
        <button
          onClick={() => fileRef.current?.click()}
          style={{ ...btn, background: 'var(--chess-border)', color: 'var(--chess-text)' }}
        >
          Upload .pgn file
        </button>
        <input ref={fileRef} type="file" accept=".pgn,text/plain" style={{ display: 'none' }} onChange={handleFile} />

        {error && <p style={{ color: '#e74c3c', fontSize: 13 }}>{error}</p>}

        <button
          onClick={handleImport}
          style={{ ...btn, background: 'var(--chess-accent)', color: '#fff', padding: '10px 14px' }}
        >
          Import
        </button>
      </div>
    </Modal>
  )
}
