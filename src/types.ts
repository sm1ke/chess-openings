export type Tag = 'standard' | 'gambit' | 'trick' | 'system'

export type OpponentLevel = 'stockfish' | 'advanced' | 'intermediate' | 'beginner'

export interface Inaccuracy {
  moves: string[]           // SAN sequence up to and including bad move
  badMove: string           // last element of moves
  level: 'beginner' | 'intermediate' | 'advanced'
  explanation: string
  punishment: string        // text description
  punishmentMoves: string[] // SAN of correct reply move(s)
}

export interface Opening {
  id: string
  name: string
  color: 'white' | 'black'
  pgn: string
  tags: Tag[]
  moves: string[]
  description?: string
  inaccuracies?: Inaccuracy[]
}

export interface OpeningSet {
  id: string
  name: string
  openingIds: string[]
}

export interface Progress {
  openingId: string
  attempts: number
  successes: number
  lastPracticed: number // timestamp
  furthestCorrectMove: number
}
