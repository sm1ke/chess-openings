import type { Opening, OpeningSet, Progress } from '../types'

export interface StorageAdapter {
  // Openings
  getOpenings(): Promise<Opening[]>
  saveOpening(opening: Opening): Promise<void>
  deleteOpening(id: string): Promise<void>

  // Sets
  getOpeningSets(): Promise<OpeningSet[]>
  saveOpeningSet(set: OpeningSet): Promise<void>
  deleteOpeningSet(id: string): Promise<void>

  // Progress
  getProgress(): Promise<Progress[]>
  saveProgress(progress: Progress): Promise<void>
  resetProgress(openingId: string): Promise<void>
  resetAllProgress(): Promise<void>
}
