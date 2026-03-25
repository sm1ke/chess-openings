import type { Opening, OpeningSet, Progress } from '../types'
import type { StorageAdapter } from './StorageAdapter'

const KEYS = {
  openings: 'chess_openings',
  sets: 'chess_sets',
  progress: 'chess_progress',
}

function load<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]')
  } catch {
    return []
  }
}

function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data))
}

export class LocalStorageAdapter implements StorageAdapter {
  async getOpenings() {
    return load<Opening>(KEYS.openings)
  }

  async saveOpening(opening: Opening) {
    const all = load<Opening>(KEYS.openings)
    const idx = all.findIndex((o) => o.id === opening.id)
    if (idx >= 0) all[idx] = opening
    else all.push(opening)
    save(KEYS.openings, all)
  }

  async deleteOpening(id: string) {
    save(KEYS.openings, load<Opening>(KEYS.openings).filter((o) => o.id !== id))
  }

  async getOpeningSets() {
    return load<OpeningSet>(KEYS.sets)
  }

  async saveOpeningSet(set: OpeningSet) {
    const all = load<OpeningSet>(KEYS.sets)
    const idx = all.findIndex((s) => s.id === set.id)
    if (idx >= 0) all[idx] = set
    else all.push(set)
    save(KEYS.sets, all)
  }

  async deleteOpeningSet(id: string) {
    save(KEYS.sets, load<OpeningSet>(KEYS.sets).filter((s) => s.id !== id))
  }

  async getProgress() {
    return load<Progress>(KEYS.progress)
  }

  async saveProgress(progress: Progress) {
    const all = load<Progress>(KEYS.progress)
    const idx = all.findIndex((p) => p.openingId === progress.openingId)
    if (idx >= 0) all[idx] = progress
    else all.push(progress)
    save(KEYS.progress, all)
  }

  async resetProgress(openingId: string) {
    save(KEYS.progress, load<Progress>(KEYS.progress).filter((p) => p.openingId !== openingId))
  }

  async resetAllProgress() {
    save(KEYS.progress, [])
  }
}
