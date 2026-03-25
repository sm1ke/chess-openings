# Chess Openings Trainer - Plan

## Overview

A web app + PWA chess openings trainer. User loads chess openings in PGN format, selects which openings to practice, and plays moves on an interactive board. The app validates moves against selected openings, shows feedback (correct/wrong), and tracks progress. Deployable as a standard web app and installable on Android as a PWA (convertible to APK later via TWA/Capacitor).

## Technology

- **React** + **TypeScript** via Vite
- **PWA** with service worker for full offline support
- **chessboard**: `react-chessboard` (chess.com-style board)
- **chess logic**: `chess.js` (move validation, PGN parsing, FEN generation)
- **state**: Zustand (lightweight, persists via storage interface)
- **storage**: Abstract `StorageAdapter` interface; localStorage implementation for now. Designed so a Supabase (or any backend) adapter can be swapped in later without changing app logic.
- **styling**: Tailwind CSS, chess.com dark theme aesthetic
- **deployment**: Standard web app (Vite build → static hosting). Also installable as PWA.
- **future APK**: Bubblewrap/TWA or Capacitor wrapper

## Data Model

### Opening
```
{
  id: string
  name: string
  color: "white" | "black"
  pgn: string              // standard PGN moves
  tags: Tag[]
  moves: string[]          // parsed move sequence (SAN notation)
}
```

### Opening Tags
- **Standard** - mainline theory (e.g. Italian Game, Sicilian Defense)
- **Gambit** - involves material sacrifice for initiative
- **Trick** - trappy/punishing lines (e.g. Stafford Gambit, Englund Gambit)
- **System** - universal setups regardless of opponent (e.g. London, King's Indian Attack)

User can assign multiple tags per opening. Tags are filterable.

### Opening Set
```
{
  id: string
  name: string
  openingIds: string[]
}
```

### Progress
```
{
  openingId: string
  attempts: number
  successes: number         // full completion without error
  lastPracticed: timestamp
  furthestCorrectMove: number
}
```

## User Stories

### Opening Management

1. **Import openings from PGN** - I paste or upload a PGN file. Each game/variation becomes an opening entry. App parses the name from PGN headers or I provide one.

2. **Browse my openings library** - I see all imported openings listed, filterable by color (white/black), tag, and search. Each shows name, color dot, tags, and progress bar.

3. **Edit an opening** - I can rename, re-tag, or delete an opening.

4. **Pre-loaded openings** - App ships with common openings so I can start immediately:
   - **White standard**: Italian Game (Giuoco Piano), Ruy Lopez (mainline), Queen's Gambit (mainline), English Opening
   - **White gambits**: King's Gambit, Evans Gambit, Smith-Morra Gambit
   - **White systems**: London System, King's Indian Attack
   - **Black standard**: Sicilian Najdorf, French Defense (mainline), Caro-Kann (mainline), QGD (Orthodox)
   - **Black gambits**: Benko Gambit, Budapest Gambit
   - **Black tricks**: Stafford Gambit, Englund Gambit Trap, Elephant Gambit

### Opening Sets

5. **Create an opening set** - I group openings into named sets (e.g. "My White Repertoire", "Anti-Sicilian Lines", "Trappy Stuff").

6. **Select what to practice** - Before training, I pick one of:
   - A single opening
   - An opening set
   - All openings for a color
   - All openings
   - Filter by tag (e.g. "all tricks for black")

### Training

7. **Choose color** - I pick whether I play white or black.

8. **Board displays correct orientation** - White at bottom if I play white, black at bottom if I play black.

9. **Play my moves** - I drag or tap pieces to make moves. Only legal chess moves are allowed.

10. **Opponent plays automatically** - When it's the opponent's turn, the app picks randomly from all valid next moves across selected openings. This means if multiple openings share a position, any of their continuations may appear, keeping me on my toes.

11. **Correct move feedback** - When I play the right move (matches any selected opening continuation from this position), the piece lands, a subtle green highlight shows, and play continues.

12. **Wrong move feedback** - When I play a wrong move:
    - Big red X overlay animation
    - Board shows the correct move(s) highlighted with arrows
    - Text shows what the correct move(s) were in notation
    - "Try Again" or "Next Opening" buttons appear

13. **Opening completed** - When I reach the end of an opening line, confetti/success animation, progress saved.

14. **Retry from mistake** - After a wrong move, I can retry from that position or restart the opening.

15. **Move hints** - Optional toggle: show a subtle hint after N seconds of inactivity (highlight the correct square).

### Progress & Stats

16. **Track progress per opening** - Attempts, success rate, furthest move reached, last practiced date. All persisted to localStorage.

17. **Dashboard view** - Overview showing openings sorted by "needs practice" (low success rate or not recently practiced).

18. **Reset progress** - Per-opening or global reset.

### Offline & PWA

19. **Works fully offline** - Service worker caches all assets. All data in localStorage. No server dependency.

20. **Installable** - PWA manifest allows "Add to Home Screen" on Android. Feels like a native app.

21. **Responsive mobile-first** - Board and controls sized for phone screens. Touch-friendly drag and tap.

## UI Layout (Mobile-First)

```
┌──────────────────────┐
│  ≡  Chess Trainer  ⚙ │  <- header, hamburger menu, settings
├──────────────────────┤
│   Opponent info bar   │
├──────────────────────┤
│                      │
│                      │
│    Chess Board       │
│    (square, full     │
│     width)           │
│                      │
│                      │
├──────────────────────┤
│   Your info bar      │
├──────────────────────┤
│  Move list / status  │
│  [feedback area]     │
├──────────────────────┤
│  Nav: Library | Train│
│       | Sets | Stats │
└──────────────────────┘
```

## Chess.com Style Notes
- Dark background (#312e2b)
- Board: green/cream squares (#779952 / #eeeed2)
- Piece set: neo (or similar clean set)
- Move highlights: yellow-green translucent overlay
- Coordinates on board edges
- Smooth piece animations

## Screens
1. **Library** - browse/import/tag openings
2. **Sets** - create/edit opening sets
3. **Train Setup** - pick color, pick openings/set, start
4. **Train Board** - the actual training board with feedback
5. **Stats** - progress dashboard
