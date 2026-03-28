# Enhancement 3: Tag All Preloaded Openings

## Problem
All 18 preloaded openings have empty `tags: []`. The Tag type already supports `standard | gambit | trick | system` but no opening uses it.

## Implementation
1. Add `tags` field to each entry in `src/data/preloadedOpenings.ts`
2. Extend the backfill logic in `src/store/useStore.ts` `init()` to also patch tags onto existing stored openings that have empty tags (same pattern as description backfill)

## Tag assignments

| Opening | Tags |
|---|---|
| Italian Game: Giuoco Piano | `standard` |
| Ruy Lopez | `standard` |
| Queen's Gambit | `standard` |
| English Opening | `standard`, `system` |
| King's Gambit | `gambit` |
| Evans Gambit | `gambit` |
| Smith-Morra Gambit | `gambit` |
| London System | `system` |
| King's Indian Attack | `system` |
| Sicilian Najdorf | `standard` |
| French Defense | `standard` |
| Caro-Kann | `standard` |
| QGD Orthodox | `standard` |
| Benko Gambit | `gambit` |
| Budapest Gambit | `gambit`, `trick` |
| Stafford Gambit | `gambit`, `trick` |
| Englund Gambit Trap | `gambit`, `trick` |
| Elephant Gambit | `gambit`, `trick` |

## Affected files
- `src/data/preloadedOpenings.ts` — add tags to raw array entries
- `src/store/useStore.ts` — extend backfill to patch tags
