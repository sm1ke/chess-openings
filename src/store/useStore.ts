import { create } from 'zustand'
import type { Opening, OpeningSet, Progress, Tag } from '../types'
import type { StorageAdapter } from '../storage/StorageAdapter'
import { LocalStorageAdapter } from '../storage/LocalStorageAdapter'
import { getPreloadedOpenings } from '../data/preloadedOpenings'

export type SelectionMode = 'single' | 'set' | 'color' | 'all' | 'tag'

export interface TrainSession {
  playAs: 'white' | 'black'
  mode: SelectionMode
  openingId?: string   // mode=single
  setId?: string       // mode=set
  color?: 'white' | 'black' // mode=color
  tag?: Tag            // mode=tag
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

interface StoreState {
  adapter: StorageAdapter
  openings: Opening[]
  sets: OpeningSet[]
  progress: Progress[]
  initialized: boolean
  trainSession: TrainSession | null

  init(): Promise<void>
  setTrainSession(session: TrainSession): void
  resolveTrainOpenings(): Opening[]

  // Openings
  addOpening(opening: Omit<Opening, 'id'>): Promise<void>
  updateOpening(opening: Opening): Promise<void>
  deleteOpening(id: string): Promise<void>

  // Sets
  addOpeningSet(name: string, openingIds: string[]): Promise<void>
  updateOpeningSet(set: OpeningSet): Promise<void>
  deleteOpeningSet(id: string): Promise<void>

  // Progress
  recordAttempt(openingId: string, success: boolean, furthestMove: number): Promise<void>
  resetProgress(openingId: string): Promise<void>
  resetAllProgress(): Promise<void>
}

export const useStore = create<StoreState>((set, get) => ({
  adapter: new LocalStorageAdapter(),
  openings: [],
  sets: [],
  progress: [],
  initialized: false,
  trainSession: null,

  async init() {
    if (get().initialized) return
    const { adapter } = get()

    let openings = await adapter.getOpenings()

    // Seed preloaded openings on first run
    if (openings.length === 0) {
      const preloaded = getPreloadedOpenings()
      for (const o of preloaded) {
        await adapter.saveOpening(o)
      }
      openings = preloaded
    }

    const [sets, progress] = await Promise.all([
      adapter.getOpeningSets(),
      adapter.getProgress(),
    ])

    set({ openings, sets, progress, initialized: true })
  },

  async addOpening(data) {
    const opening: Opening = { ...data, id: generateId() }
    await get().adapter.saveOpening(opening)
    set((s) => ({ openings: [...s.openings, opening] }))
  },

  async updateOpening(opening) {
    await get().adapter.saveOpening(opening)
    set((s) => ({ openings: s.openings.map((o) => (o.id === opening.id ? opening : o)) }))
  },

  async deleteOpening(id) {
    await get().adapter.deleteOpening(id)
    set((s) => ({ openings: s.openings.filter((o) => o.id !== id) }))
  },

  async addOpeningSet(name, openingIds) {
    const s: OpeningSet = { id: generateId(), name, openingIds }
    await get().adapter.saveOpeningSet(s)
    set((st) => ({ sets: [...st.sets, s] }))
  },

  async updateOpeningSet(openingSet) {
    await get().adapter.saveOpeningSet(openingSet)
    set((s) => ({ sets: s.sets.map((x) => (x.id === openingSet.id ? openingSet : x)) }))
  },

  async deleteOpeningSet(id) {
    await get().adapter.deleteOpeningSet(id)
    set((s) => ({ sets: s.sets.filter((x) => x.id !== id) }))
  },

  async recordAttempt(openingId, success, furthestMove) {
    const existing = get().progress.find((p) => p.openingId === openingId)
    const updated: Progress = {
      openingId,
      attempts: (existing?.attempts ?? 0) + 1,
      successes: (existing?.successes ?? 0) + (success ? 1 : 0),
      lastPracticed: Date.now(),
      furthestCorrectMove: Math.max(existing?.furthestCorrectMove ?? 0, furthestMove),
    }
    await get().adapter.saveProgress(updated)
    set((s) => ({
      progress: existing
        ? s.progress.map((p) => (p.openingId === openingId ? updated : p))
        : [...s.progress, updated],
    }))
  },

  async resetProgress(openingId) {
    await get().adapter.resetProgress(openingId)
    set((s) => ({ progress: s.progress.filter((p) => p.openingId !== openingId) }))
  },

  async resetAllProgress() {
    await get().adapter.resetAllProgress()
    set({ progress: [] })
  },

  setTrainSession(session) {
    set({ trainSession: session })
  },

  resolveTrainOpenings() {
    const { trainSession, openings, sets } = get()
    if (!trainSession) return []
    const { mode, openingId, setId, color, tag } = trainSession
    switch (mode) {
      case 'single':
        return openings.filter((o) => o.id === openingId)
      case 'set': {
        const s = sets.find((s) => s.id === setId)
        return s ? openings.filter((o) => s.openingIds.includes(o.id)) : []
      }
      case 'color':
        return openings.filter((o) => o.color === color)
      case 'tag':
        return openings.filter((o) => tag && o.tags.includes(tag))
      case 'all':
      default:
        return openings
    }
  },
}))
