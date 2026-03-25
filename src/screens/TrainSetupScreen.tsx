import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import type { SelectionMode, TrainSession } from '../store/useStore'
import type { Tag } from '../types'

const ALL_TAGS: Tag[] = ['standard', 'gambit', 'trick', 'system']

export function TrainSetupScreen() {
  const navigate = useNavigate()
  const openings = useStore((s) => s.openings)
  const sets = useStore((s) => s.sets)
  const setTrainSession = useStore((s) => s.setTrainSession)

  const [playAs, setPlayAs] = useState<'white' | 'black'>('white')
  const [mode, setMode] = useState<SelectionMode>('all')
  const [openingId, setOpeningId] = useState<string>(openings[0]?.id ?? '')
  const [setId, setSetId] = useState<string>(sets[0]?.id ?? '')
  const [color, setColor] = useState<'white' | 'black'>('white')
  const [tag, setTag] = useState<Tag>('standard')
  const [search, setSearch] = useState('')

  const filteredOpenings = openings.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase())
  )

  function countForMode(): number {
    switch (mode) {
      case 'single': return openingId ? 1 : 0
      case 'set': {
        const s = sets.find((s) => s.id === setId)
        return s?.openingIds.length ?? 0
      }
      case 'color': return openings.filter((o) => o.color === color).length
      case 'tag': return openings.filter((o) => o.tags.includes(tag)).length
      case 'all': return openings.length
    }
  }

  function handleStart() {
    const session: TrainSession = { playAs, mode, openingId, setId, color, tag }
    setTrainSession(session)
    navigate('/train/board')
  }

  const count = countForMode()

  const btn: React.CSSProperties = {
    border: 'none', borderRadius: 4, cursor: 'pointer', padding: '7px 14px', fontSize: 13,
  }
  const section: React.CSSProperties = {
    background: 'var(--chess-sidebar)',
    border: '1px solid var(--chess-border)',
    borderRadius: 6, padding: '12px',
  }
  const label: React.CSSProperties = {
    color: 'var(--chess-text-muted)', fontSize: 11, textTransform: 'uppercase',
    letterSpacing: 1, marginBottom: 8, display: 'block',
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      {/* Play as */}
      <div style={section}>
        <span style={label}>Play as</span>
        <div className="flex gap-2">
          {(['white', 'black'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setPlayAs(c)}
              style={{
                ...btn, flex: 1,
                background: playAs === c ? 'var(--chess-accent)' : 'var(--chess-border)',
                color: playAs === c ? '#fff' : 'var(--chess-text)',
              }}
            >
              {c === 'white' ? '⬜ White' : '⬛ Black'}
            </button>
          ))}
        </div>
      </div>

      {/* Selection mode */}
      <div style={section}>
        <span style={label}>Practice</span>
        <div className="flex flex-col gap-2">
          {([
            { id: 'all', label: 'All openings' },
            { id: 'color', label: 'By color' },
            { id: 'tag', label: 'By tag' },
            { id: 'set', label: 'Opening set' },
            { id: 'single', label: 'Single opening' },
          ] as { id: SelectionMode; label: string }[]).map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                ...btn, textAlign: 'left',
                background: mode === m.id ? 'var(--chess-accent)22' : 'transparent',
                border: mode === m.id ? '1px solid var(--chess-accent)' : '1px solid var(--chess-border)',
                color: mode === m.id ? 'var(--chess-accent)' : 'var(--chess-text)',
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Sub-selector */}
        {mode === 'color' && (
          <div className="flex gap-2 mt-3">
            {(['white', 'black'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                  ...btn, flex: 1,
                  background: color === c ? 'var(--chess-accent)' : 'var(--chess-border)',
                  color: color === c ? '#fff' : 'var(--chess-text)',
                }}
              >
                {c === 'white' ? '⬜ White' : '⬛ Black'}
              </button>
            ))}
          </div>
        )}

        {mode === 'tag' && (
          <div className="flex flex-wrap gap-2 mt-3">
            {ALL_TAGS.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                style={{
                  ...btn,
                  background: tag === t ? 'var(--chess-accent)' : 'var(--chess-border)',
                  color: tag === t ? '#fff' : 'var(--chess-text)',
                  textTransform: 'capitalize',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {mode === 'set' && (
          <div className="flex flex-col gap-1 mt-3">
            {sets.length === 0
              ? <p style={{ color: 'var(--chess-text-muted)', fontSize: 13 }}>No sets created yet.</p>
              : sets.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSetId(s.id)}
                  style={{
                    ...btn, textAlign: 'left',
                    background: setId === s.id ? 'var(--chess-accent)22' : 'var(--chess-border)',
                    border: setId === s.id ? '1px solid var(--chess-accent)' : '1px solid transparent',
                    color: 'var(--chess-text)',
                  }}
                >
                  {s.name} <span style={{ color: 'var(--chess-text-muted)' }}>({s.openingIds.length})</span>
                </button>
              ))
            }
          </div>
        )}

        {mode === 'single' && (
          <div className="flex flex-col gap-2 mt-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search openings…"
              style={{
                background: 'var(--chess-bg)', color: 'var(--chess-text)',
                border: '1px solid var(--chess-border)', borderRadius: 4,
                padding: '7px 10px', fontSize: 13,
              }}
            />
            <div className="flex flex-col gap-1" style={{ maxHeight: 200, overflowY: 'auto' }}>
              {filteredOpenings.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setOpeningId(o.id)}
                  style={{
                    ...btn, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8,
                    background: openingId === o.id ? 'var(--chess-accent)22' : 'var(--chess-border)',
                    border: openingId === o.id ? '1px solid var(--chess-accent)' : '1px solid transparent',
                    color: 'var(--chess-text)',
                  }}
                >
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: o.color === 'white' ? '#eeeed2' : '#312e2b',
                    border: '1px solid var(--chess-border)',
                  }} />
                  {o.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Start button */}
      <button
        onClick={handleStart}
        disabled={count === 0}
        style={{
          ...btn,
          background: count > 0 ? 'var(--chess-accent)' : 'var(--chess-border)',
          color: count > 0 ? '#fff' : 'var(--chess-text-muted)',
          padding: '14px', fontSize: 16, borderRadius: 8,
          cursor: count > 0 ? 'pointer' : 'not-allowed',
        }}
      >
        Start Training {count > 0 && `(${count} opening${count !== 1 ? 's' : ''})`}
      </button>

      {/* Review button — only for single opening */}
      {mode === 'single' && openingId && (
        <button
          onClick={() => navigate(`/review?id=${openingId}`)}
          style={{
            ...btn,
            background: 'transparent',
            border: '1px solid var(--chess-border)',
            color: 'var(--chess-text)',
            padding: '12px', fontSize: 14, borderRadius: 8,
          }}
        >
          📖 Review This Opening
        </button>
      )}
    </div>
  )
}
