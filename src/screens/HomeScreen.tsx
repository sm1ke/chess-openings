import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import type { TrainSession } from '../store/useStore'

// Featured openings: name must match preloaded opening names exactly
const FEATURED: { name: string; icon: string; color: 'white' | 'black'; hint: string }[] = [
  { name: 'Ruy Lopez',              icon: '♗', color: 'white', hint: '1.e4 e5 2.Nf3 Nc6 3.Bb5' },
  { name: 'Italian Game: Giuoco Piano', icon: '♗', color: 'white', hint: '1.e4 e5 2.Nf3 Nc6 3.Bc4' },
  { name: "Queen's Gambit",          icon: '♕', color: 'white', hint: '1.d4 d5 2.c4' },
  { name: 'London System',           icon: '♗', color: 'white', hint: '1.d4 d5 2.Bf4' },
  { name: "King's Gambit",           icon: '♙', color: 'white', hint: '1.e4 e5 2.f4' },
  { name: 'Sicilian Najdorf',        icon: '♟', color: 'black', hint: '1.e4 c5 … a6' },
  { name: 'French Defense',          icon: '♟', color: 'black', hint: '1.e4 e6 2.d4 d5' },
  { name: 'Caro-Kann',               icon: '♟', color: 'black', hint: '1.e4 c6 2.d4 d5' },
  { name: 'Stafford Gambit',         icon: '♞', color: 'black', hint: '1.e4 e5 2.Nf3 Nf6 3.Nxe5' },
  { name: 'Benko Gambit',            icon: '♟', color: 'black', hint: '1.d4 Nf6 2.c4 c5 3.d5 b5' },
]

export function HomeScreen() {
  const navigate = useNavigate()
  const openings = useStore((s) => s.openings)
  const trainSession = useStore((s) => s.trainSession)
  const setTrainSession = useStore((s) => s.setTrainSession)

  function startSingle(openingName: string, color: 'white' | 'black') {
    const opening = openings.find((o) => o.name === openingName)
    if (!opening) return
    const session: TrainSession = {
      playAs: color,
      mode: 'single',
      openingId: opening.id,
    }
    setTrainSession(session)
    navigate('/train/board')
  }

  function continueLastSession() {
    navigate('/train/board')
  }

  const cardBase: React.CSSProperties = {
    background: 'var(--chess-sidebar)',
    border: '1px solid var(--chess-border)',
    borderRadius: 8,
    cursor: 'pointer',
    padding: '12px 10px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  }

  return (
    <div className="flex flex-col gap-4 p-3 pb-6">
      {/* Hero */}
      <div style={{ textAlign: 'center', paddingTop: 8 }}>
        <p style={{ fontSize: 40, margin: 0 }}>♞</p>
        <p style={{ color: 'var(--chess-text)', fontSize: 20, fontWeight: 700, margin: '4px 0 2px' }}>
          Chess Trainer
        </p>
        <p style={{ color: 'var(--chess-text-muted)', fontSize: 13, margin: 0 }}>
          Practice your openings
        </p>
      </div>

      {/* Continue last session */}
      {trainSession && (
        <button
          onClick={continueLastSession}
          style={{
            border: 'none', borderRadius: 8, cursor: 'pointer',
            background: 'var(--chess-accent)', color: '#fff',
            padding: '14px 16px', fontSize: 15, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          ▶ Continue Last Session
        </button>
      )}

      {/* Quick actions */}
      <div className="flex gap-2">
        <button
          onClick={() => navigate('/train')}
          style={{
            flex: 1, border: '1px solid var(--chess-accent)', borderRadius: 8, cursor: 'pointer',
            background: 'transparent', color: 'var(--chess-accent)',
            padding: '12px', fontSize: 14, fontWeight: 600,
          }}
        >
          Custom Setup
        </button>
        <button
          onClick={() => navigate('/stats')}
          style={{
            flex: 1, border: '1px solid var(--chess-border)', borderRadius: 8, cursor: 'pointer',
            background: 'var(--chess-sidebar)', color: 'var(--chess-text)',
            padding: '12px', fontSize: 14,
          }}
        >
          📊 My Stats
        </button>
      </div>

      {/* Featured openings */}
      <div>
        <p style={{ color: 'var(--chess-text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 10px' }}>
          Featured Openings
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {FEATURED.map((f) => {
            const exists = openings.some((o) => o.name === f.name)
            if (!exists) return null
            return (
              <button
                key={f.name}
                onClick={() => startSingle(f.name, f.color)}
                style={{
                  ...cardBase,
                  borderTop: `3px solid ${f.color === 'white' ? '#81b64c' : '#4a90d9'}`,
                }}
              >
                <span style={{
                  fontSize: 32,
                  color: f.color === 'white' ? '#eeeed2' : '#312e2b',
                  textShadow: f.color === 'white'
                    ? '0 0 0 1px #666, 1px 1px 2px rgba(0,0,0,0.5)'
                    : '0 0 0 1px #aaa, 1px 1px 2px rgba(255,255,255,0.2)',
                  lineHeight: 1,
                }}>
                  {f.icon}
                </span>
                <span style={{ color: 'var(--chess-text)', fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}>
                  {f.name.replace('Italian Game: ', '')}
                </span>
                <span style={{ color: 'var(--chess-text-muted)', fontSize: 10 }}>
                  {f.hint}
                </span>
                <span style={{
                  marginTop: 2,
                  fontSize: 9, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase',
                  color: f.color === 'white' ? '#81b64c' : '#4a90d9',
                }}>
                  {f.color === 'white' ? '⬜ White' : '⬛ Black'}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
