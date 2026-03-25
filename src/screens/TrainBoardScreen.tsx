import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { useStore } from '../store/useStore'
import { buildOpeningTree } from '../utils/buildOpeningTree'
import type { Opening } from '../types'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Arrow = { startSquare: string; endSquare: string; color: string }
type PieceDropHandlerArgs = { piece: unknown; sourceSquare: string; targetSquare: string | null }
type SquareHandlerArgs = { piece: unknown; square: string }

type Phase = 'playing' | 'wrong' | 'complete' | 'alldone'

export function TrainBoardScreen() {
  const navigate = useNavigate()
  const trainSession = useStore((s) => s.trainSession)
  const resolveTrainOpenings = useStore((s) => s.resolveTrainOpenings)
  const recordAttempt = useStore((s) => s.recordAttempt)
  const hintSettings = useStore((s) => s.hintSettings)

  const sessionOpenings = useRef<Opening[]>([])
  const tree = useRef<Map<string, string[]>>(new Map())

  const [openingIdx, setOpeningIdx] = useState(0)
  const [chess] = useState(() => new Chess())
  const [fen, setFen] = useState(chess.fen())
  const [phase, setPhase] = useState<Phase>('playing')

  // Board sizing refs (kept for potential future use)
  const outerRef = useRef<HTMLDivElement>(null)
  const boardWrapRef = useRef<HTMLDivElement>(null)
  const [wrongInfo, setWrongInfo] = useState<{ played: string; correct: string[] } | null>(null)
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null)
  const [hintMoves, setHintMoves] = useState<string[]>([])
  const [hintArrows, setHintArrows] = useState<Arrow[]>([])
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const arrowHintTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const furthestMove = useRef(0)
  const selectedSq = useRef<string | null>(null)

  const playAs = trainSession?.playAs ?? 'white'

  useEffect(() => {
    if (!trainSession) { navigate('/train'); return }
    const openings = resolveTrainOpenings()
    if (openings.length === 0) { navigate('/train'); return }
    sessionOpenings.current = openings
    tree.current = buildOpeningTree(openings)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const currentOpening = sessionOpenings.current[openingIdx]

  const resetBoard = useCallback(() => {
    chess.reset()
    setFen(chess.fen())
    setPhase('playing')
    setWrongInfo(null)
    setLastMove(null)
    setHintMoves([])
    setHintArrows([])
    furthestMove.current = 0
    selectedSq.current = null
    if (hintTimer.current) clearTimeout(hintTimer.current)
    if (arrowHintTimer.current) clearTimeout(arrowHintTimer.current)
  }, [chess])

  useEffect(() => { resetBoard() }, [openingIdx]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-play opponent move
  useEffect(() => {
    if (phase !== 'playing') return
    const isMyTurn = chess.turn() === (playAs === 'white' ? 'w' : 'b')
    if (isMyTurn) return

    const validMoves = tree.current.get(chess.fen()) ?? []
    if (validMoves.length === 0) { handleComplete(); return }

    const pick = validMoves[Math.floor(Math.random() * validMoves.length)]
    const timeout = setTimeout(() => {
      const result = chess.move(pick)
      if (result) {
        furthestMove.current = chess.history().length
        setLastMove({ from: result.from, to: result.to })
        setFen(chess.fen())
      }
    }, 350)
    return () => clearTimeout(timeout)
  }) // intentionally runs every render

  // Hint timers (square + arrow)
  useEffect(() => {
    if (phase !== 'playing') return
    const isMyTurn = chess.turn() === (playAs === 'white' ? 'w' : 'b')
    if (!isMyTurn) { setHintMoves([]); setHintArrows([]); return }

    if (hintTimer.current) clearTimeout(hintTimer.current)
    if (arrowHintTimer.current) clearTimeout(arrowHintTimer.current)

    if (hintSettings.squareEnabled) {
      hintTimer.current = setTimeout(() => {
        setHintMoves(tree.current.get(chess.fen()) ?? [])
      }, hintSettings.squareDelay * 1000)
    }

    if (hintSettings.arrowEnabled) {
      arrowHintTimer.current = setTimeout(() => {
        const moves = tree.current.get(chess.fen()) ?? []
        const tmp = new Chess(chess.fen())
        const computed: Arrow[] = []
        for (const san of moves) {
          try {
            const m = tmp.move(san)
            if (m) { computed.push({ startSquare: m.from, endSquare: m.to, color: '#4a90d9' }); tmp.undo() }
          } catch { /* skip */ }
        }
        setHintArrows(computed)
      }, hintSettings.arrowDelay * 1000)
    }

    return () => {
      if (hintTimer.current) clearTimeout(hintTimer.current)
      if (arrowHintTimer.current) clearTimeout(arrowHintTimer.current)
    }
  }, [fen, phase]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleComplete() {
    setPhase('complete')
    if (currentOpening) recordAttempt(currentOpening.id, true, furthestMove.current)
  }

  function applyUserMove(from: string, to: string, promotion = 'q'): boolean {
    if (phase !== 'playing') return false
    const isMyTurn = chess.turn() === (playAs === 'white' ? 'w' : 'b')
    if (!isMyTurn) return false

    const tmp = new Chess(chess.fen())
    let result
    try { result = tmp.move({ from, to, promotion }) } catch { return false }
    if (!result) return false

    const validMoves = tree.current.get(chess.fen()) ?? []

    if (validMoves.includes(result.san)) {
      chess.move(result.san)
      furthestMove.current = chess.history().length
      setLastMove({ from: result.from, to: result.to })
      setFen(chess.fen())
      setHintMoves([])
      setHintArrows([])
      if (hintTimer.current) clearTimeout(hintTimer.current)
      if (arrowHintTimer.current) clearTimeout(arrowHintTimer.current)
      // Check if complete (no more user continuations after opponent's upcoming move)
      return true
    } else {
      setPhase('wrong')
      setWrongInfo({ played: result.san, correct: validMoves })
      if (currentOpening) recordAttempt(currentOpening.id, false, furthestMove.current)
      return false
    }
  }

  function handlePieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs): boolean {
    if (!targetSquare) return false
    selectedSq.current = null
    return applyUserMove(sourceSquare, targetSquare)
  }

  function handleSquareClick({ square }: SquareHandlerArgs) {
    if (phase !== 'playing') return
    const isMyTurn = chess.turn() === (playAs === 'white' ? 'w' : 'b')
    if (!isMyTurn) return

    if (selectedSq.current) {
      const moved = applyUserMove(selectedSq.current, square)
      selectedSq.current = null
      if (!moved) {
        // Maybe re-select if clicking own piece
        const piece = chess.get(square as Parameters<typeof chess.get>[0])
        if (piece && piece.color === (playAs === 'white' ? 'w' : 'b')) {
          selectedSq.current = square
        }
      }
    } else {
      const piece = chess.get(square as Parameters<typeof chess.get>[0])
      if (piece && piece.color === (playAs === 'white' ? 'w' : 'b')) {
        selectedSq.current = square
      }
    }
  }

  function handleNextOpening() {
    const next = openingIdx + 1
    if (next >= sessionOpenings.current.length) setPhase('alldone')
    else setOpeningIdx(next)
  }

  // Square styles
  const squareStyles: Record<string, React.CSSProperties> = {}
  if (lastMove && phase !== 'wrong') {
    const hl: React.CSSProperties = { backgroundColor: 'rgba(130,184,76,0.4)' }
    squareStyles[lastMove.from] = hl
    squareStyles[lastMove.to] = hl
  }
  if (hintMoves.length > 0 && phase === 'playing') {
    const tmp = new Chess(chess.fen())
    for (const san of hintMoves) {
      try { const m = tmp.move(san); if (m) { squareStyles[m.to] = { backgroundColor: 'rgba(255,213,0,0.5)' }; tmp.undo() } } catch { /* skip */ }
    }
  }

  // Arrows: wrong-move correct answers + hint arrows
  const arrows: Arrow[] = []
  if (phase === 'wrong' && wrongInfo) {
    const tmp = new Chess(chess.fen())
    for (const san of wrongInfo.correct) {
      try {
        const m = tmp.move(san)
        if (m) { arrows.push({ startSquare: m.from, endSquare: m.to, color: '#82b84c' }); tmp.undo() }
      } catch { /* skip */ }
    }
  } else if (phase === 'playing' && hintArrows.length > 0) {
    arrows.push(...hintArrows)
  }

  const moveHistory = chess.history()

  const panelStyle: React.CSSProperties = {
    background: 'var(--chess-sidebar)',
    border: '1px solid var(--chess-border)',
    borderRadius: 0, padding: '10px 12px',
    borderLeft: 'none', borderRight: 'none',
  }

  if (!trainSession || sessionOpenings.current.length === 0) {
    return <p style={{ color: 'var(--chess-text)', padding: 16 }}>Loading…</p>
  }

  if (phase === 'alldone') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6" style={{ minHeight: '60vh' }}>
        <p style={{ fontSize: 40 }}>🎉</p>
        <p style={{ color: 'var(--chess-text)', fontSize: 18, fontWeight: 600 }}>All done!</p>
        <p style={{ color: 'var(--chess-text-muted)', fontSize: 14 }}>
          Practiced {sessionOpenings.current.length} opening{sessionOpenings.current.length !== 1 ? 's' : ''}
        </p>
        <button onClick={() => navigate('/train')} style={{
          border: 'none', borderRadius: 6, cursor: 'pointer',
          background: 'var(--chess-accent)', color: '#fff', padding: '12px 24px', fontSize: 15,
        }}>
          Back to Setup
        </button>
      </div>
    )
  }

  return (
    <div ref={outerRef} className="flex flex-col" style={{ overflow: 'hidden' }}>
      {/* Board — constrained to fit within viewport height */}
      <div ref={boardWrapRef} style={{ position: 'relative', width: 'min(100%, calc(100svh - 200px))', alignSelf: 'center', flexShrink: 0 }}>
        <Chessboard
          options={{
            position: fen,
            boardOrientation: playAs,
            onPieceDrop: handlePieceDrop,
            onSquareClick: handleSquareClick,
            squareStyles,
            arrows,
            boardStyle: { borderRadius: 0 },
            darkSquareStyle: { backgroundColor: '#779952' },
            lightSquareStyle: { backgroundColor: '#eeeed2' },
            animationDurationInMs: 150,
            allowDragging: phase === 'playing',
            allowDrawingArrows: false,
          }}
        />
        {phase === 'wrong' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ background: 'rgba(192,57,43,0.15)' }}>
            <span className="overlay-icon" style={{ fontSize: 80, lineHeight: 1 }}>✗</span>
          </div>
        )}
        {phase === 'complete' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ background: 'rgba(39,174,96,0.15)' }}>
            <span className="overlay-icon" style={{ fontSize: 80, lineHeight: 1 }}>✓</span>
          </div>
        )}
      </div>

      {/* Feedback / move list */}
      <div style={panelStyle}>
        {phase === 'playing' && (
          moveHistory.length === 0
            ? <p style={{ color: 'var(--chess-text-muted)', fontSize: 13, margin: 0 }}>
                {chess.turn() === (playAs === 'white' ? 'w' : 'b') ? 'Your turn — make a move' : 'Opponent thinking…'}
              </p>
            : <div className="flex flex-wrap gap-1">
                {moveHistory.map((m, i) => (
                  <span key={i} style={{ fontSize: 12 }}>
                    {i % 2 === 0 && <span style={{ color: 'var(--chess-text-muted)' }}>{Math.floor(i / 2) + 1}.</span>}
                    <span style={{ color: i % 2 === (playAs === 'white' ? 0 : 1) ? 'var(--chess-text)' : 'var(--chess-text-muted)' }}>{m} </span>
                  </span>
                ))}
              </div>
        )}

        {phase === 'wrong' && wrongInfo && (
          <div className="flex flex-col gap-2">
            <p style={{ color: '#e74c3c', fontSize: 14, margin: 0, fontWeight: 600 }}>
              ✗ Wrong — you played {wrongInfo.played}
            </p>
            <p style={{ color: 'var(--chess-text-muted)', fontSize: 13, margin: 0 }}>
              Correct: {wrongInfo.correct.join(', ')}
            </p>
            <div className="flex gap-2 mt-1">
              <button onClick={resetBoard} style={{ flex: 1, border: 'none', borderRadius: 4, cursor: 'pointer', background: 'var(--chess-accent)', color: '#fff', padding: '8px', fontSize: 13 }}>
                Try Again
              </button>
              <button onClick={handleNextOpening} style={{ flex: 1, border: 'none', borderRadius: 4, cursor: 'pointer', background: 'var(--chess-border)', color: 'var(--chess-text)', padding: '8px', fontSize: 13 }}>
                Next Opening
              </button>
            </div>
          </div>
        )}

        {phase === 'complete' && (
          <div className="flex flex-col gap-2">
            <p style={{ color: '#27ae60', fontSize: 14, margin: 0, fontWeight: 600 }}>✓ Opening complete!</p>
            <div className="flex gap-2 mt-1">
              <button onClick={resetBoard} style={{ flex: 1, border: 'none', borderRadius: 4, cursor: 'pointer', background: 'var(--chess-border)', color: 'var(--chess-text)', padding: '8px', fontSize: 13 }}>
                Repeat
              </button>
              <button onClick={handleNextOpening} style={{ flex: 1, border: 'none', borderRadius: 4, cursor: 'pointer', background: 'var(--chess-accent)', color: '#fff', padding: '8px', fontSize: 13 }}>
                Next Opening
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div style={panelStyle}>
        <p style={{ color: 'var(--chess-text-muted)', fontSize: 11, margin: 0 }}>
          {openingIdx + 1} / {sessionOpenings.current.length} — {currentOpening?.name}
        </p>
        <div style={{ height: 2, background: 'var(--chess-border)', borderRadius: 1, marginTop: 6 }}>
          <div style={{
            height: '100%', borderRadius: 1, transition: 'width 0.4s',
            width: `${((openingIdx + (phase === 'complete' ? 1 : 0)) / sessionOpenings.current.length) * 100}%`,
            background: 'var(--chess-accent)',
          }} />
        </div>
      </div>
    </div>
  )
}
