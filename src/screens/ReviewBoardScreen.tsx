import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { useStore } from '../store/useStore'
import type { TrainSession } from '../store/useStore'

export function ReviewBoardScreen() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const openingId = params.get('id') ?? ''
  const openings = useStore((s) => s.openings)
  const setTrainSession = useStore((s) => s.setTrainSession)
  const opening = openings.find((o) => o.id === openingId)

  const [moveIdx, setMoveIdx] = useState(-1) // -1 = starting position
  const [autoPlay, setAutoPlay] = useState(false)
  const [showDesc, setShowDesc] = useState(true)
  const outerRef = useRef<HTMLDivElement>(null)
  const boardWrapRef = useRef<HTMLDivElement>(null)

  // Build FEN at each move index
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

  // Auto-play timer
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

  const panelStyle: React.CSSProperties = {
    background: 'var(--chess-sidebar)',
    border: '1px solid var(--chess-border)',
    borderLeft: 'none', borderRight: 'none',
    padding: '10px 12px',
  }

  // Parse markdown-lite description (bold **text**, paragraphs on \n or \n\n)
  function renderDesc(text: string) {
    const paras = text.split(/\n\n|\n/).filter(Boolean)
    return paras.map((para, i) => {
      const parts = para.split(/\*\*(.+?)\*\*/g)
      return (
        <p key={i} style={{ margin: '0 0 8px', fontSize: 13, lineHeight: 1.6, color: 'var(--chess-text)' }}>
          {parts.map((part, j) =>
            j % 2 === 1
              ? <strong key={j} style={{ color: 'var(--chess-accent)' }}>{part}</strong>
              : part
          )}
        </p>
      )
    })
  }

  const btnStyle = (active = false): React.CSSProperties => ({
    border: 'none', borderRadius: 4, cursor: 'pointer',
    padding: '8px 16px', fontSize: 13,
    background: active ? 'var(--chess-accent)' : 'var(--chess-border)',
    color: active ? '#fff' : 'var(--chess-text)',
  })

  return (
    <div ref={outerRef} className="flex flex-col" style={{ overflow: 'hidden' }}>
      {/* Board */}
      <div ref={boardWrapRef} style={{ width: 'min(100%, calc(100svh - 290px))', alignSelf: 'center', flexShrink: 0, position: 'relative' }}>
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

      {/* Move counter + controls */}
      <div style={panelStyle}>
        <div className="flex items-center gap-2 justify-between">
          <span style={{ color: 'var(--chess-text-muted)', fontSize: 12 }}>
            Move {Math.max(0, moveIdx + 1)} / {total}
            {moveIdx >= 0 && (
              <span style={{ color: 'var(--chess-text)', marginLeft: 8 }}>
                {moveHistory[moveHistory.length - 1]}
              </span>
            )}
          </span>
          <div className="flex gap-2">
            <button onClick={reset} style={btnStyle()}>↩</button>
            <button onClick={prev} disabled={moveIdx < 0} style={btnStyle()}>←</button>
            <button onClick={next} disabled={moveIdx >= total - 1} style={btnStyle()}>→</button>
            <button
              onClick={() => setAutoPlay((v) => !v)}
              style={btnStyle(autoPlay)}
            >
              {autoPlay ? '⏸' : '▶'}
            </button>
          </div>
        </div>

        {/* Mini move list */}
        {moveHistory.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {moveHistory.map((m, i) => (
              <span
                key={i}
                onClick={() => setMoveIdx(i)}
                style={{
                  fontSize: 11, cursor: 'pointer',
                  color: i === moveIdx ? 'var(--chess-accent)' : 'var(--chess-text-muted)',
                  fontWeight: i === moveIdx ? 600 : 400,
                }}
              >
                {i % 2 === 0 && <span style={{ color: 'var(--chess-text-muted)' }}>{Math.floor(i / 2) + 1}.</span>}
                {m}{' '}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Description panel */}
      {opening.description && (
        <div style={{ ...panelStyle, borderBottom: 'none' }}>
          <button
            onClick={() => setShowDesc((v) => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 6, marginBottom: showDesc ? 8 : 0 }}
          >
            <span style={{ color: 'var(--chess-accent)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
              Opening Guide
            </span>
            <span style={{ color: 'var(--chess-text-muted)', fontSize: 12 }}>{showDesc ? '▲' : '▼'}</span>
          </button>
          {showDesc && (
            <div style={{ maxHeight: 200, overflowY: 'auto' }}>
              {renderDesc(opening.description)}
            </div>
          )}
        </div>
      )}

      {!opening.description && (
        <div style={panelStyle}>
          <p style={{ color: 'var(--chess-text-muted)', fontSize: 13, margin: 0 }}>
            No description yet. Edit this opening in the Library to add one.
          </p>
        </div>
      )}

      {/* Back + Practice buttons */}
      <div style={{ ...panelStyle, borderBottom: 'none', display: 'flex', gap: 8 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ border: 'none', borderRadius: 4, cursor: 'pointer', background: 'var(--chess-border)', color: 'var(--chess-text)', padding: '8px 16px', fontSize: 13 }}
        >
          ← Back
        </button>
        <button
          onClick={practiceOpening}
          style={{ flex: 1, border: 'none', borderRadius: 4, cursor: 'pointer', background: 'var(--chess-accent)', color: '#fff', padding: '8px 16px', fontSize: 13, fontWeight: 600 }}
        >
          ▶ Practice This Opening
        </button>
      </div>
    </div>
  )
}
