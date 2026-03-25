import { Chess } from 'chess.js'
import type { Opening, Tag } from '../types'

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

/** Extract header value from PGN, e.g. [White "e4"] */
function header(pgn: string, key: string): string {
  const m = pgn.match(new RegExp(`\\[${key}\\s+"([^"]*)"\\]`))
  return m ? m[1] : ''
}

/** Strip PGN headers, returning just the moves section */
function movesSection(pgn: string): string {
  return pgn.replace(/\[[^\]]*\]\s*/g, '').trim()
}

/**
 * Parse a PGN string (may contain multiple games) into Opening objects.
 * Name is taken from the Opening header, or falls back to the White header,
 * or finally to "Unnamed Opening".
 */
export function parsePgn(
  pgn: string,
  defaults: { color?: 'white' | 'black'; tags?: Tag[] } = {}
): Opening[] {
  // Split multi-game PGN by double newlines before a tag or by [Event markers
  const games = pgn
    .split(/(?=\[Event\s)/)
    .map((g) => g.trim())
    .filter(Boolean)

  const results: Opening[] = []

  for (const game of games) {
    try {
      const chess = new Chess()
      chess.loadPgn(movesSection(game).length ? game : game)

      const moves = chess.history() // SAN move list

      if (moves.length === 0) continue

      const name =
        header(game, 'Opening') ||
        header(game, 'White') ||
        'Unnamed Opening'

      // Infer color from whose turn it is after move 1 (black moved = white opened)
      const color: 'white' | 'black' =
        defaults.color ?? (moves.length % 2 === 1 ? 'white' : 'black')

      results.push({
        id: generateId(),
        name,
        color,
        pgn: game,
        tags: defaults.tags ?? [],
        moves,
      })
    } catch {
      // skip malformed games
    }
  }

  return results
}
