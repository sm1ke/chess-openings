import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { useStore } from '../store/useStore'
import type { TrainSession } from '../store/useStore'

type View = 'guide' | 'board'

export function ReviewBoardScreen() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const openingId = params.get('id') ?? ''
  const openings = useStore((s) => s.openings)
  const setTrainSession = useStore((s) => s.setTrainSession)
  const opening = openings.find((o) => o.id === openingId)

  const [view, setView] = useState<View>('guide')
  const [moveIdx, setMoveIdx] = useState(-1)
  const [autoPlay, setAutoPlay] = useState(false)

  const fens = useRef<string[]>([])
  useEffect(() => {
    if (!opening) return
    const chess = new Chess()
    const list: string[] = [chess.fen()]
    for (const move of opening.moves) {
      try { chess.move(move) } catch { break }
      list.push(chess.fen())
    }
    fens.current = list
    setMoveIdx(-1)
  }, [opening?.id])

  useEffect(() => {
    if (!autoPlay) return
    const total = fens.current.length - 1
    if (moveIdx >= total) { setAutoPlay(false); return }
    const t = setTimeout(() => setMoveIdx((i) => i + 1), 800)
    return () => clearTimeout(t)
  }, [autoPlay, moveIdx])

  if (!opening) {
    return <p style={{ color: 'var(--chess-text)', padding: 16 }}>Opening not found.</p>
  }

  const total = fens.current.length - 1
  const currentFen = fens.current[moveIdx + 1] ?? fens.current[0]
  const moveHistory = opening.moves.slice(0, moveIdx + 1)

  function practiceOpening() {
    const session: TrainSession = { playAs: opening!.color, mode: 'single', openingId: opening!.id }
    setTrainSession(session)
    navigate('/train/board')
  }

  function prev() { setAutoPlay(false); setMoveIdx((i) => Math.max(-1, i - 1)) }
  function next() { setMoveIdx((i) => Math.min(total - 1, i + 1)) }
  function reset() { setAutoPlay(false); setMoveIdx(-1) }

  function renderDesc(text: string) {
    const paras = text.split(/\n\n|\n/).filter(Boolean)
    return paras.map((para, i) => {
      const parts = para.split(/\*\*(.+?)\*\*/g)
      return (
        <p key={i} style={{ margin: '0 0 12px', fontSize: 15, lineHeight: 1.7, color: 'var(--chess-text)' }}>
          {parts.map((part, j) =>
            j % 2 === 1
              ? <strong key={j} style={{ color: 'var(--chess-accent)' }}>{part}</strong>
              : part
          )}
        </p>
      )
    })
  }

  const stickyBar: React.CSSProperties = {
    position: 'sticky', bottom: 0,
    background: 'var(--chess-sidebar)',
    borderTop: '1px solid var(--chess-border)',
    padding: '10px 12px',
    display: 'flex', gap: 8,
  }

  const btnSecondary: React.CSSProperties = {
    border: '1px solid var(--chess-border)', borderRadius: 6, cursor: 'pointer',
    background: 'var(--chess-sidebar)', color: 'var(--chess-text)',
    padding: '10px 14px', fontSize: 13,
  }

  const btnPrimary: React.CSSProperties = {
    flex: 1, border: 'none', borderRadius: 6, cursor: 'pointer',
    background: 'var(--chess-accent)', color: '#fff',
    padding: '10px 14px', fontSize: 14, fontWeight: 600,
  }

  // ── GUIDE VIEW ──────────────────────────────────────────────────────────────
  if (view === 'guide') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        {/* Opening name */}
        <div style={{ padding: '16px 16px 4px' }}>
          <p style={{ color: 'var(--chess-text-muted)', fontSize: 11, margin: 0, textTransform: 'uppercase', letterSpacing: 1 }}>Opening Guide</p>
          <p style={{ color: 'var(--chess-text)', fontSize: 18, fontWeight: 700, margin: '4px 0 0' }}>{opening.name}</p>
          <p style={{ color: 'var(--chess-text-muted)', fontSize: 12, margin: '2px 0 0' }}>
            Playing as {opening.color}
          </p>
        </div>

        {/* Description */}
        <div style={{ flex: 1, padding: '16px 16px 0', overflowY: 'auto' }}>
          {opening.description
            ? renderDesc(opening.description)
            : <p style={{ color: 'var(--chess-text-muted)', fontSize: 14 }}>No description yet.</p>
          }
        </div>

        {/* Sticky action bar */}
        <div style={stickyBar}>
          <button onClick={() => navigate(-1)} style={btnSecondary}>← Back</button>
          <button onClick={() => setView('board')} style={{ ...btnSecondary, color: 'var(--chess-accent)' }}>
            Step Through Moves
          </button>
          <button onClick={practiceOpening} style={btnPrimary}>▶ Practice</button>
        </div>
      </div>
    )
  }

  // ── BOARD VIEW ───────────────────────────────────────────────────────────────
  const panelStyle: React.CSSProperties = {
    background: 'var(--chess-sidebar)',
    borderTop: '1px solid var(--chess-border)',
    padding: '10px 12px',
  }

  const btnSmall = (active = false): React.CSSProperties => ({
    border: 'none', borderRadius: 4, cursor: 'pointer',
    padding: '8px 14px', fontSize: 13,
    background: active ? 'var(--chess-accent)' : 'var(--chess-border)',
    color: active ? '#fff' : 'var(--chess-text)',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Board */}
      <div style={{ width: 'min(100%, calc(100svh - 230px))', alignSelf: 'center', flexShrink: 0 }}>
        <Chessboard
          options={{
            position: currentFen,
            boardOrientation: opening.color,
            allowDragging: false,
            allowDrawingArrows: false,
            boardStyle: { borderRadius: 0 },
            darkSquareStyle: { backgroundColor: '#779952' },
            lightSquareStyle: { backgroundColor: '#eeeed2' },
            animationDurationInMs: 200,
          }}
        />
      </div>

      {/* Controls */}
      <div style={panelStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--chess-text-muted)', fontSize: 12 }}>
            Move {Math.max(0, moveIdx + 1)} / {total}
            {moveIdx >= 0 && <span style={{ color: 'var(--chess-text)', marginLeft: 8 }}>{moveHistory[moveHistory.length - 1]}</span>}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={reset} style={btnSmall()}>↩</button>
            <button onClick={prev} disabled={moveIdx < 0} style={btnSmall()}>←</button>
            <button onClick={next} disabled={moveIdx >= total - 1} style={btnSmall()}>→</button>
            <button onClick={() => setAutoPlay((v) => !v)} style={btnSmall(autoPlay)}>
              {autoPlay ? '⏸' : '▶'}
            </button>
          </div>
        </div>
        {moveHistory.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
            {moveHistory.map((m, i) => (
              <span key={i} onClick={() => setMoveIdx(i)} style={{ fontSize: 11, cursor: 'pointer', color: i === moveIdx ? 'var(--chess-accent)' : 'var(--chess-text-muted)', fontWeight: i === moveIdx ? 600 : 400 }}>
                {i % 2 === 0 && <span style={{ color: 'var(--chess-text-muted)' }}>{Math.floor(i / 2) + 1}.</span>}
                {m}{' '}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div style={{ ...panelStyle, display: 'flex', gap: 8 }}>
        <button onClick={() => setView('guide')} style={btnSecondary}>📖 Guide</button>
        <button onClick={practiceOpening} style={btnPrimary}>▶ Practice</button>
      </div>
    </div>
  )
}
