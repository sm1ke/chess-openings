import type { ReactNode } from 'react'

interface Props {
  title: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ title, onClose, children }: Props) {
  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.6)' }}
        onClick={onClose}
      />
      <div
        className="fixed z-50 flex flex-col"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 'min(92vw, 480px)',
          maxHeight: '80vh',
          background: 'var(--chess-panel)',
          border: '1px solid var(--chess-border)',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: '1px solid var(--chess-border)' }}
        >
          <span className="font-semibold" style={{ color: 'var(--chess-text)' }}>{title}</span>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--chess-text-muted)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </div>
    </>
  )
}
