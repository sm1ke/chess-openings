import { create } from 'zustand'
import type { Opening, OpeningSet, Progress, Tag, OpponentLevel } from '../types'
import type { StorageAdapter } from '../storage/StorageAdapter'
import { LocalStorageAdapter } from '../storage/LocalStorageAdapter'
import { getPreloadedOpenings } from '../data/preloadedOpenings'

export type SelectionMode = 'single' | 'set' | 'color' | 'all' | 'tag'

export interface HintSettings {
  squareEnabled: boolean
  squareDelay: number  // seconds
  arrowEnabled: boolean
  arrowDelay: number   // seconds
}

const DEFAULT_HINTS: HintSettings = {
  squareEnabled: true,
  squareDelay: 4,
  arrowEnabled: false,
  arrowDelay: 8,
}

function loadHintSettings(): HintSettings {
  try {
    const raw = localStorage.getItem('hint-settings')
    if (raw) return { ...DEFAULT_HINTS, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return DEFAULT_HINTS
}

function loadOpponentLevel(): OpponentLevel {
  try {
    const raw = localStorage.getItem('opponent-level')
    if (raw) return raw as OpponentLevel
  } catch { /* ignore */ }
  return 'intermediate'
}

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
  hintSettings: HintSettings
  opponentLevel: OpponentLevel

  init(): Promise<void>
  setTrainSession(session: TrainSession): void
  updateHintSettings(settings: HintSettings): void
  updateOpponentLevel(level: OpponentLevel): void
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
  hintSettings: loadHintSettings(),
  opponentLevel: loadOpponentLevel(),

  async init() {
    if (get().initialized) return
    const { adapter } = get()

    let openings = await adapter.getOpenings()

    const preloaded = getPreloadedOpenings()

    // Seed preloaded openings on first run
    if (openings.length === 0) {
      for (const o of preloaded) {
        await adapter.saveOpening(o)
      }
      openings = preloaded
    } else {
      // Backfill descriptions onto preloaded openings that don't have one yet
      const updated: typeof openings = []
      for (const o of openings) {
        const pre = preloaded.find((p) => p.name === o.name && !o.description)
        if (pre?.description) {
          const patched = { ...o, description: pre.description }
          await adapter.saveOpening(patched)
          updated.push(patched)
        } else {
          updated.push(o)
        }
      }
      openings = updated
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

  updateHintSettings(settings) {
    localStorage.setItem('hint-settings', JSON.stringify(settings))
    set({ hintSettings: settings })
  },

  updateOpponentLevel(level) {
    localStorage.setItem('opponent-level', level)
    set({ opponentLevel: level })
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
