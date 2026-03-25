import { useState } from 'react'
import { Modal } from './Modal'
import { useStore } from '../store/useStore'
import type { Opening, Tag } from '../types'

interface Props {
  opening: Opening
  onClose: () => void
}

const ALL_TAGS: Tag[] = ['standard', 'gambit', 'trick', 'system']

export function EditOpeningModal({ opening, onClose }: Props) {
  const updateOpening = useStore((s) => s.updateOpening)
  const deleteOpening = useStore((s) => s.deleteOpening)
  const [name, setName] = useState(opening.name)
  const [color, setColor] = useState(opening.color)
  const [tags, setTags] = useState<Tag[]>(opening.tags)
  const [confirming, setConfirming] = useState(false)

  function toggleTag(t: Tag) {
    setTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])
  }

  async function handleSave() {
    await updateOpening({ ...opening, name, color, tags })
    onClose()
  }

  async function handleDelete() {
    await deleteOpening(opening.id)
    onClose()
  }

  const btn: React.CSSProperties = {
    border: 'none', borderRadius: 4, cursor: 'pointer', padding: '6px 14px', fontSize: 13,
  }

  return (
    <Modal title="Edit Opening" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            background: 'var(--chess-bg)', color: 'var(--chess-text)',
            border: '1px solid var(--chess-border)', borderRadius: 4,
            padding: '8px 10px', fontSize: 14,
          }}
        />

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

        <button
          onClick={handleSave}
          style={{ ...btn, background: 'var(--chess-accent)', color: '#fff', padding: '10px 14px' }}
        >
          Save
        </button>

        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            style={{ ...btn, background: '#7b2d2d', color: '#ffaaaa', padding: '10px 14px' }}
          >
            Delete Opening
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              style={{ ...btn, background: '#c0392b', color: '#fff', flex: 1 }}
            >
              Confirm Delete
            </button>
            <button
              onClick={() => setConfirming(false)}
              style={{ ...btn, background: 'var(--chess-border)', color: 'var(--chess-text)', flex: 1 }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </Modal>
  )
}
