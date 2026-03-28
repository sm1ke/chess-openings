import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { ArrowLeft, SkipBack, ChevronLeft, ChevronRight, Play, Pause, BookOpen } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { TrainSession } from '../store/useStore'

export function ReviewBoardScreen() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const openingId = params.get('id') ?? ''
  const openings = useStore((s) => s.openings)
  const setTrainSession = useStore((s) => s.setTrainSession)
  const opening = openings.find((o) => o.id === openingId)

  // Start on guide view; switch to board when user clicks "Step Through"
  const [view, setView] = useState<'guide' | 'board'>('guide')
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

  // Renders **bold** markdown, - bullet lists, ### headings
  function renderDesc(text: string) {
    if (!text) return <p style={{ color: 'var(--chess-text-muted)', fontSize: 14 }}>No description yet.</p>

    // Split on double or single newline
    const paras = text.split(/\n\n+/).filter(Boolean)

    return (
      <>
        {paras.map((para, i) => {
          const trimmed = para.trim()

          // ### heading
          if (trimmed.startsWith('### ')) {
            return (
              <p key={i} style={{ color: 'var(--chess-accent)', fontSize: 13, fontWeight: 700, margin: '16px 0 4px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {trimmed.slice(4)}
              </p>
            )
          }

          // Render inline bold: **text**
          function renderInline(s: string) {
            const parts = s.split(/\*\*([^*]+)\*\*/g)
            return parts.map((part, j) =>
              j % 2 === 1
                ? <strong key={j} style={{ color: 'var(--chess-accent)', fontWeight: 700 }}>{part}</strong>
                : part
            )
          }

          // Bullet list — lines starting with "- "
          const lines = trimmed.split('\n')
          const isBulletBlock = lines.every((l) => l.trim().startsWith('- ') || l.trim() === '')
          if (isBulletBlock && lines.some((l) => l.trim().startsWith('- '))) {
            return (
              <ul key={i} style={{ margin: '0 0 12px', paddingLeft: 20, color: 'var(--chess-text)' }}>
                {lines.filter((l) => l.trim().startsWith('- ')).map((l, j) => (
                  <li key={j} style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 2 }}>
                    {renderInline(l.trim().slice(2))}
                  </li>
                ))}
              </ul>
            )
          }

          // Regular paragraph (may have embedded newlines — render each line)
          return (
            <p key={i} style={{ margin: '0 0 14px', fontSize: 14, lineHeight: 1.8, color: 'var(--chess-text)' }}>
              {lines.map((line, j) => (
                <span key={j}>
                  {j > 0 && <br />}
                  {renderInline(line)}
                </span>
              ))}
            </p>
          )
        })}
      </>
    )
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

  // ── GUIDE VIEW (full-screen) ────────────────────────────────────────────────
  if (view === 'guide') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Header strip */}
        <div style={{ padding: '14px 16px 10px', flexShrink: 0, borderBottom: '1px solid var(--chess-border)', background: 'var(--chess-sidebar)' }}>
          <p style={{ color: 'var(--chess-text-muted)', fontSize: 10, margin: 0, textTransform: 'uppercase', letterSpacing: 1 }}>Opening Guide</p>
          <p style={{ color: 'var(--chess-text)', fontSize: 17, fontWeight: 700, margin: '3px 0 0' }}>{opening.name}</p>
          <p style={{ color: 'var(--chess-text-muted)', fontSize: 12, margin: '2px 0 0' }}>
            Playing as {opening.color} · {opening.moves.length} moves
          </p>
        </div>

        {/* Scrollable description */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
          {renderDesc(opening.description ?? '')}
        </div>

        {/* Sticky action bar */}
        <div style={{
          flexShrink: 0, borderTop: '1px solid var(--chess-border)',
          background: 'var(--chess-sidebar)', padding: '10px 12px',
          display: 'flex', gap: 8,
        }}>
          <button onClick={() => navigate(-1)} style={{ ...btnSecondary, display: 'flex', alignItems: 'center', gap: 6 }}><ArrowLeft size={16} /> Back</button>
          <button
            onClick={() => setView('board')}
            style={{ ...btnSecondary, color: 'var(--chess-accent)', border: '1px solid var(--chess-accent)' }}
          >
            Step Through
          </button>
          <button onClick={practiceOpening} style={{ ...btnPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Play size={15} fill="currentColor" /> Practice</button>
        </div>
      </div>
    )
  }

  // ── BOARD VIEW ────────────────────────────────────────────────────────────
  const panelStyle: React.CSSProperties = {
    background: 'var(--chess-sidebar)',
    borderTop: '1px solid var(--chess-border)',
    padding: '10px 12px',
    flexShrink: 0,
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
      <div style={{ width: 'min(100%, calc(100svh - 200px))', alignSelf: 'center', flexShrink: 0 }}>
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
            <button onClick={reset} style={{ ...btnSmall(), display: 'flex', alignItems: 'center' }}><SkipBack size={16} /></button>
            <button onClick={prev} disabled={moveIdx < 0} style={{ ...btnSmall(), display: 'flex', alignItems: 'center' }}><ChevronLeft size={16} /></button>
            <button onClick={next} disabled={moveIdx >= total - 1} style={{ ...btnSmall(), display: 'flex', alignItems: 'center' }}><ChevronRight size={16} /></button>
            <button onClick={() => setAutoPlay((v) => !v)} style={{ ...btnSmall(autoPlay), display: 'flex', alignItems: 'center' }}>
              {autoPlay ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
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
        <button onClick={() => setView('guide')} style={{ ...btnSecondary, display: 'flex', alignItems: 'center', gap: 6 }}><BookOpen size={16} /> Guide</button>
        <button onClick={practiceOpening} style={{ ...btnPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Play size={15} fill="currentColor" /> Practice</button>
      </div>
    </div>
  )
}
