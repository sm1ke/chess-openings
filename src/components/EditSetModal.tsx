import { useState } from 'react'
import { Modal } from './Modal'
import { useStore } from '../store/useStore'
import type { OpeningSet } from '../types'

interface Props {
  set?: OpeningSet
  onClose: () => void
}

export function EditSetModal({ set, onClose }: Props) {
  const openings = useStore((s) => s.openings)
  const addOpeningSet = useStore((s) => s.addOpeningSet)
  const updateOpeningSet = useStore((s) => s.updateOpeningSet)
  const deleteOpeningSet = useStore((s) => s.deleteOpeningSet)

  const [name, setName] = useState(set?.name ?? '')
  const [selected, setSelected] = useState<Set<string>>(new Set(set?.openingIds ?? []))
  const [confirming, setConfirming] = useState(false)
  const [search, setSearch] = useState('')

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function handleSave() {
    if (!name.trim()) return
    if (set) {
      await updateOpeningSet({ ...set, name, openingIds: [...selected] })
    } else {
      await addOpeningSet(name, [...selected])
    }
    onClose()
  }

  async function handleDelete() {
    if (set) await deleteOpeningSet(set.id)
    onClose()
  }

  const filtered = openings.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase())
  )

  const btn: React.CSSProperties = {
    border: 'none', borderRadius: 4, cursor: 'pointer', padding: '6px 14px', fontSize: 13,
  }

  return (
    <Modal title={set ? 'Edit Set' : 'New Set'} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Set name…"
          style={{
            background: 'var(--chess-bg)', color: 'var(--chess-text)',
            border: '1px solid var(--chess-border)', borderRadius: 4,
            padding: '8px 10px', fontSize: 14,
          }}
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter openings…"
          style={{
            background: 'var(--chess-bg)', color: 'var(--chess-text)',
            border: '1px solid var(--chess-border)', borderRadius: 4,
            padding: '7px 10px', fontSize: 13,
          }}
        />

        <div className="flex flex-col gap-1" style={{ maxHeight: 240, overflowY: 'auto' }}>
          {filtered.map((o) => {
            const on = selected.has(o.id)
            return (
              <button
                key={o.id}
                onClick={() => toggle(o.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: on ? 'var(--chess-accent)22' : 'var(--chess-border)',
                  border: on ? '1px solid var(--chess-accent)' : '1px solid transparent',
                  borderRadius: 4, padding: '7px 10px', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: o.color === 'white' ? '#eeeed2' : '#312e2b',
                  border: '1px solid var(--chess-border)',
                }} />
                <span style={{ color: 'var(--chess-text)', fontSize: 13, flex: 1 }}>{o.name}</span>
                {on && <span style={{ color: 'var(--chess-accent)', fontSize: 12 }}>✓</span>}
              </button>
            )
          })}
        </div>

        <p style={{ color: 'var(--chess-text-muted)', fontSize: 12, margin: 0 }}>
          {selected.size} opening{selected.size !== 1 ? 's' : ''} selected
        </p>

        <button
          onClick={handleSave}
          style={{ ...btn, background: 'var(--chess-accent)', color: '#fff', padding: '10px 14px' }}
        >
          {set ? 'Save' : 'Create Set'}
        </button>

        {set && !confirming && (
          <button
            onClick={() => setConfirming(true)}
            style={{ ...btn, background: '#7b2d2d', color: '#ffaaaa', padding: '10px 14px' }}
          >
            Delete Set
          </button>
        )}
        {set && confirming && (
          <div className="flex gap-2">
            <button onClick={handleDelete} style={{ ...btn, background: '#c0392b', color: '#fff', flex: 1 }}>
              Confirm Delete
            </button>
            <button onClick={() => setConfirming(false)} style={{ ...btn, background: 'var(--chess-border)', color: 'var(--chess-text)', flex: 1 }}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </Modal>
  )
}
