import { useState, useMemo } from 'react'
import { useStore } from '../store/useStore'
import { ImportModal } from '../components/ImportModal'
import { EditOpeningModal } from '../components/EditOpeningModal'
import type { Opening, Tag } from '../types'

const ALL_TAGS: Tag[] = ['standard', 'gambit', 'trick', 'system']

function tagColor(tag: Tag): string {
  return { standard: '#4a90d9', gambit: '#e67e22', trick: '#9b59b6', system: '#27ae60' }[tag]
}

export function LibraryScreen() {
  const openings = useStore((s) => s.openings)
  const progress = useStore((s) => s.progress)

  const [search, setSearch] = useState('')
  const [colorFilter, setColorFilter] = useState<'all' | 'white' | 'black'>('all')
  const [tagFilter, setTagFilter] = useState<Tag | null>(null)
  const [importing, setImporting] = useState(false)
  const [editing, setEditing] = useState<Opening | null>(null)

  const filtered = useMemo(() => {
    return openings.filter((o) => {
      if (colorFilter !== 'all' && o.color !== colorFilter) return false
      if (tagFilter && !o.tags.includes(tagFilter)) return false
      if (search && !o.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [openings, colorFilter, tagFilter, search])

  function getProgress(id: string) {
    return progress.find((p) => p.openingId === id)
  }

  const input: React.CSSProperties = {
    background: 'var(--chess-sidebar)', color: 'var(--chess-text)',
    border: '1px solid var(--chess-border)', borderRadius: 4,
    padding: '8px 10px', fontSize: 14, width: '100%',
  }

  const chipBase: React.CSSProperties = {
    border: 'none', borderRadius: 4, cursor: 'pointer',
    padding: '5px 12px', fontSize: 12, fontWeight: 500,
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      {/* Search */}
      <input
        style={input}
        placeholder="Search openings…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Color filter */}
      <div className="flex gap-2">
        {(['all', 'white', 'black'] as const).map((c) => (
          <button
            key={c}
            onClick={() => setColorFilter(c)}
            style={{
              ...chipBase, flex: 1,
              background: colorFilter === c ? 'var(--chess-accent)' : 'var(--chess-border)',
              color: colorFilter === c ? '#fff' : 'var(--chess-text)',
              textTransform: 'capitalize',
            }}
          >
            {c === 'all' ? 'All' : c === 'white' ? '⬜ White' : '⬛ Black'}
          </button>
        ))}
      </div>

      {/* Tag filter */}
      <div className="flex flex-wrap gap-2">
        {ALL_TAGS.map((t) => (
          <button
            key={t}
            onClick={() => setTagFilter(tagFilter === t ? null : t)}
            style={{
              ...chipBase,
              background: tagFilter === t ? tagColor(t) : 'var(--chess-border)',
              color: tagFilter === t ? '#fff' : 'var(--chess-text)',
              textTransform: 'capitalize',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Import button */}
      <button
        onClick={() => setImporting(true)}
        style={{
          ...chipBase,
          background: 'var(--chess-accent)', color: '#fff',
          padding: '10px 14px', fontSize: 14, borderRadius: 6,
        }}
      >
        + Import Opening
      </button>

      {/* Opening list */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 && (
          <p style={{ color: 'var(--chess-text-muted)', fontSize: 14 }}>No openings found.</p>
        )}
        {filtered.map((o) => {
          const prog = getProgress(o.id)
          const pct = prog && prog.attempts > 0
            ? Math.round((prog.successes / prog.attempts) * 100)
            : null

          return (
            <button
              key={o.id}
              onClick={() => setEditing(o)}
              style={{
                background: 'var(--chess-sidebar)',
                border: '1px solid var(--chess-border)',
                borderRadius: 6, cursor: 'pointer',
                padding: '10px 12px', textAlign: 'left',
              }}
            >
              <div className="flex items-center gap-2">
                {/* Color dot */}
                <span style={{
                  width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                  background: o.color === 'white' ? '#eeeed2' : '#312e2b',
                  border: '1px solid var(--chess-border)',
                }} />

                {/* Name */}
                <span style={{ color: 'var(--chess-text)', fontSize: 14, flex: 1 }}>{o.name}</span>

                {/* Move count */}
                <span style={{ color: 'var(--chess-text-muted)', fontSize: 11 }}>
                  {o.moves.length}m
                </span>
              </div>

              {/* Tags */}
              {o.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1 ml-4">
                  {o.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: 10, padding: '1px 6px', borderRadius: 3,
                        background: tagColor(t) + '33', color: tagColor(t),
                        textTransform: 'capitalize',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Progress bar */}
              <div className="mt-2 ml-4" style={{ height: 3, background: 'var(--chess-border)', borderRadius: 2 }}>
                <div
                  style={{
                    height: '100%', borderRadius: 2,
                    width: `${pct ?? 0}%`,
                    background: pct !== null ? 'var(--chess-accent)' : 'transparent',
                    transition: 'width 0.3s',
                  }}
                />
              </div>
              {pct !== null && (
                <p style={{ color: 'var(--chess-text-muted)', fontSize: 10, margin: '2px 0 0 16px' }}>
                  {pct}% ({prog!.successes}/{prog!.attempts})
                </p>
              )}
            </button>
          )
        })}
      </div>

      {importing && <ImportModal onClose={() => setImporting(false)} />}
      {editing && <EditOpeningModal opening={editing} onClose={() => setEditing(null)} />}
    </div>
  )
}
