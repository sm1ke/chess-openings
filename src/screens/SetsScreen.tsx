import { useState } from 'react'
import { useStore } from '../store/useStore'
import { EditSetModal } from '../components/EditSetModal'
import type { OpeningSet } from '../types'

export function SetsScreen() {
  const sets = useStore((s) => s.sets)
  const openings = useStore((s) => s.openings)
  const [editing, setEditing] = useState<OpeningSet | null | 'new'>(null)

  function nameOf(id: string) {
    return openings.find((o) => o.id === id)?.name ?? '?'
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      <button
        onClick={() => setEditing('new')}
        style={{
          border: 'none', borderRadius: 6, cursor: 'pointer',
          background: 'var(--chess-accent)', color: '#fff',
          padding: '10px 14px', fontSize: 14,
        }}
      >
        + New Set
      </button>

      {sets.length === 0 && (
        <p style={{ color: 'var(--chess-text-muted)', fontSize: 14 }}>No sets yet.</p>
      )}

      {sets.map((s) => (
        <button
          key={s.id}
          onClick={() => setEditing(s)}
          style={{
            background: 'var(--chess-sidebar)',
            border: '1px solid var(--chess-border)',
            borderRadius: 6, cursor: 'pointer',
            padding: '10px 12px', textAlign: 'left',
          }}
        >
          <p style={{ color: 'var(--chess-text)', fontSize: 14, margin: 0, fontWeight: 500 }}>
            {s.name}
          </p>
          <p style={{ color: 'var(--chess-text-muted)', fontSize: 12, margin: '4px 0 0' }}>
            {s.openingIds.length} opening{s.openingIds.length !== 1 ? 's' : ''}
            {s.openingIds.length > 0 && (
              <> — {s.openingIds.slice(0, 3).map(nameOf).join(', ')}{s.openingIds.length > 3 ? '…' : ''}</>
            )}
          </p>
        </button>
      ))}

      {editing === 'new' && <EditSetModal onClose={() => setEditing(null)} />}
      {editing && editing !== 'new' && (
        <EditSetModal set={editing} onClose={() => setEditing(null)} />
      )}
    </div>
  )
}
