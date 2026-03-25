export type Tag = 'standard' | 'gambit' | 'trick' | 'system'

export interface Opening {
  id: string
  name: string
  color: 'white' | 'black'
  pgn: string
  tags: Tag[]
  moves: string[]
  description?: string
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
