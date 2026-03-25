import { Chess } from 'chess.js'
import type { Opening } from '../types'

/**
 * Builds a map from FEN -> valid next SAN moves across all given openings.
 * Handles transpositions naturally since FEN captures full position state.
 */
export function buildOpeningTree(openings: Opening[]): Map<string, string[]> {
  const tree = new Map<string, string[]>()

  for (const opening of openings) {
    const chess = new Chess()
    for (const move of opening.moves) {
      const fen = chess.fen()
      const existing = tree.get(fen) ?? []
      if (!existing.includes(move)) {
        tree.set(fen, [...existing, move])
      }
      try {
        chess.move(move)
      } catch {
        break // malformed opening
      }
    }
  }

  return tree
}
