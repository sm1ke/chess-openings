import { useState } from 'react'
import { useStore } from '../store/useStore'

function needsPracticeScore(attempts: number, successes: number, lastPracticed: number): number {
  const rate = attempts > 0 ? successes / attempts : 0
  const daysSince = (Date.now() - lastPracticed) / 86400000
  // Lower score = needs more practice
  return rate - Math.min(daysSince / 30, 1) * 0.5
}

function formatDate(ts: number): string {
  if (!ts) return 'Never'
  const d = new Date(ts)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function StatsScreen() {
  const openings = useStore((s) => s.openings)
  const progress = useStore((s) => s.progress)
  const resetProgress = useStore((s) => s.resetProgress)
  const resetAllProgress = useStore((s) => s.resetAllProgress)
  const [confirmReset, setConfirmReset] = useState<string | 'all' | null>(null)

  // Sort: unpracticed first, then by needs-practice score ascending
  const sorted = [...openings].sort((a, b) => {
    const pa = progress.find((p) => p.openingId === a.id)
    const pb = progress.find((p) => p.openingId === b.id)
    if (!pa && !pb) return 0
    if (!pa) return -1
    if (!pb) return 1
    return needsPracticeScore(pa.attempts, pa.successes, pa.lastPracticed)
         - needsPracticeScore(pb.attempts, pb.successes, pb.lastPracticed)
  })

  async function handleReset(id: string) {
    await resetProgress(id)
    setConfirmReset(null)
  }

  async function handleResetAll() {
    await resetAllProgress()
    setConfirmReset(null)
  }

  const btn: React.CSSProperties = {
    border: 'none', borderRadius: 4, cursor: 'pointer', padding: '6px 12px', fontSize: 12,
  }
  const card: React.CSSProperties = {
    background: 'var(--chess-sidebar)', border: '1px solid var(--chess-border)',
    borderRadius: 6, padding: '10px 12px',
  }

  const practiced = progress.length
  const totalAttempts = progress.reduce((s, p) => s + p.attempts, 0)
  const totalSuccesses = progress.reduce((s, p) => s + p.successes, 0)
  const globalRate = totalAttempts > 0 ? Math.round((totalSuccesses / totalAttempts) * 100) : null

  return (
    <div className="flex flex-col gap-3 p-3">
      {/* Summary */}
      <div style={card}>
        <p style={{ color: 'var(--chess-text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 8px' }}>
          Overview
        </p>
        <div className="flex gap-4">
          <div>
            <p style={{ color: 'var(--chess-accent)', fontSize: 22, fontWeight: 700, margin: 0 }}>{practiced}</p>
            <p style={{ color: 'var(--chess-text-muted)', fontSize: 11, margin: 0 }}>practiced</p>
          </div>
          <div>
            <p style={{ color: 'var(--chess-accent)', fontSize: 22, fontWeight: 700, margin: 0 }}>{totalAttempts}</p>
            <p style={{ color: 'var(--chess-text-muted)', fontSize: 11, margin: 0 }}>attempts</p>
          </div>
          <div>
            <p style={{ color: 'var(--chess-accent)', fontSize: 22, fontWeight: 700, margin: 0 }}>
              {globalRate !== null ? `${globalRate}%` : '—'}
            </p>
            <p style={{ color: 'var(--chess-text-muted)', fontSize: 11, margin: 0 }}>success rate</p>
          </div>
        </div>
      </div>

      {/* Reset all */}
      <div className="flex justify-end">
        {confirmReset !== 'all' ? (
          <button onClick={() => setConfirmReset('all')} style={{ ...btn, background: '#7b2d2d', color: '#ffaaaa' }}>
            Reset All Progress
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleResetAll} style={{ ...btn, background: '#c0392b', color: '#fff' }}>Confirm Reset All</button>
            <button onClick={() => setConfirmReset(null)} style={{ ...btn, background: 'var(--chess-border)', color: 'var(--chess-text)' }}>Cancel</button>
          </div>
        )}
      </div>

      {/* Opening list */}
      <p style={{ color: 'var(--chess-text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>
        Openings — sorted by needs practice
      </p>

      {sorted.map((o) => {
        const p = progress.find((pr) => pr.openingId === o.id)
        const rate = p && p.attempts > 0 ? Math.round((p.successes / p.attempts) * 100) : null
        const rateColor = rate === null ? 'var(--chess-text-muted)' : rate >= 75 ? '#27ae60' : rate >= 40 ? '#e67e22' : '#e74c3c'

        return (
          <div key={o.id} style={card}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2" style={{ flex: 1, minWidth: 0 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 3,
                  background: o.color === 'white' ? '#eeeed2' : '#312e2b',
                  border: '1px solid var(--chess-border)',
                }} />
                <p style={{ color: 'var(--chess-text)', fontSize: 13, fontWeight: 500, margin: 0 }}>{o.name}</p>
              </div>
              <span style={{ color: rateColor, fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
                {rate !== null ? `${rate}%` : '—'}
              </span>
            </div>

            {p ? (
              <>
                {/* Progress bar */}
                <div style={{ height: 3, background: 'var(--chess-border)', borderRadius: 2, margin: '8px 0 6px 16px' }}>
                  <div style={{
                    height: '100%', borderRadius: 2, background: rateColor,
                    width: `${rate ?? 0}%`, transition: 'width 0.3s',
                  }} />
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 ml-4">
                  <span style={{ color: 'var(--chess-text-muted)', fontSize: 11 }}>
                    {p.successes}/{p.attempts} attempts
                  </span>
                  <span style={{ color: 'var(--chess-text-muted)', fontSize: 11 }}>
                    furthest move: {p.furthestCorrectMove}
                  </span>
                  <span style={{ color: 'var(--chess-text-muted)', fontSize: 11 }}>
                    last: {formatDate(p.lastPracticed)}
                  </span>
                </div>

                <div className="flex justify-end mt-2">
                  {confirmReset === o.id ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleReset(o.id)} style={{ ...btn, background: '#c0392b', color: '#fff' }}>Confirm</button>
                      <button onClick={() => setConfirmReset(null)} style={{ ...btn, background: 'var(--chess-border)', color: 'var(--chess-text)' }}>Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmReset(o.id)} style={{ ...btn, background: 'transparent', color: 'var(--chess-text-muted)' }}>
                      Reset
                    </button>
                  )}
                </div>
              </>
            ) : (
              <p style={{ color: 'var(--chess-text-muted)', fontSize: 12, margin: '6px 0 0 16px' }}>Not yet practiced</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
