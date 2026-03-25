import { useStore } from '../store/useStore'
import type { HintSettings } from '../store/useStore'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 16px',
      borderBottom: '1px solid var(--chess-border)',
    }}>
      <span style={{ color: 'var(--chess-text)', fontSize: 14 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{children}</div>
    </div>
  )
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
        background: value ? 'var(--chess-accent)' : 'var(--chess-border)',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 2, width: 20, height: 20, borderRadius: '50%',
        background: '#fff', transition: 'left 0.2s',
        left: value ? 22 : 2,
      }} />
    </button>
  )
}

function SecondsPicker({ value, onChange, min = 1, max = 60 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        style={{ width: 28, height: 28, border: '1px solid var(--chess-border)', borderRadius: 4, background: 'var(--chess-sidebar)', color: 'var(--chess-text)', cursor: 'pointer', fontSize: 16 }}
      >−</button>
      <span style={{ color: 'var(--chess-text)', fontSize: 14, minWidth: 48, textAlign: 'center' }}>{value}s</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        style={{ width: 28, height: 28, border: '1px solid var(--chess-border)', borderRadius: 4, background: 'var(--chess-sidebar)', color: 'var(--chess-text)', cursor: 'pointer', fontSize: 16 }}
      >+</button>
    </div>
  )
}

export function SettingsScreen() {
  const hints = useStore((s) => s.hintSettings)
  const update = useStore((s) => s.updateHintSettings)

  function patch(partial: Partial<HintSettings>) {
    update({ ...hints, ...partial })
  }

  const sectionLabel: React.CSSProperties = {
    color: 'var(--chess-text-muted)', fontSize: 11, textTransform: 'uppercase',
    letterSpacing: 1, padding: '16px 16px 6px',
  }

  return (
    <div className="flex flex-col pb-8">
      <p style={sectionLabel}>Square Highlight Hint</p>
      <div style={{ background: 'var(--chess-sidebar)', borderTop: '1px solid var(--chess-border)' }}>
        <Row label="Show square hint">
          <Toggle value={hints.squareEnabled} onChange={(v) => patch({ squareEnabled: v })} />
        </Row>
        {hints.squareEnabled && (
          <Row label="Delay before showing">
            <SecondsPicker value={hints.squareDelay} onChange={(v) => patch({ squareDelay: v })} />
          </Row>
        )}
      </div>

      <p style={sectionLabel}>Full Move Arrow Hint</p>
      <div style={{ background: 'var(--chess-sidebar)', borderTop: '1px solid var(--chess-border)' }}>
        <Row label="Show arrow hint">
          <Toggle value={hints.arrowEnabled} onChange={(v) => patch({ arrowEnabled: v })} />
        </Row>
        {hints.arrowEnabled && (
          <Row label="Delay before showing">
            <SecondsPicker value={hints.arrowDelay} onChange={(v) => patch({ arrowDelay: v })} />
          </Row>
        )}
      </div>

      <p style={{ color: 'var(--chess-text-muted)', fontSize: 12, padding: '12px 16px' }}>
        Hints appear during training when it's your turn. Square hint highlights destination squares; arrow hint shows the full piece move.
      </p>
    </div>
  )
}
