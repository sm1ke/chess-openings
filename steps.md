# Chess Openings Trainer - Implementation Steps

## 1. Project Setup

- [x] Init Vite + React + TypeScript project
- [x] Install deps: react-chessboard, chess.js, zustand, tailwindcss
- [x] Configure Tailwind with chess.com dark theme colors
- [x] Set up PWA plugin (vite-plugin-pwa) with basic manifest
- [x] Create app shell layout (header, main content, bottom nav)

## 2. Data Layer

- [x] Define TypeScript types (Opening, OpeningSet, Progress, Tag)
- [x] Define `StorageAdapter` interface (CRUD for openings, sets, progress) so backend can be swapped later
- [x] Implement `LocalStorageAdapter` fulfilling the interface
- [x] Create Zustand store wired to StorageAdapter (not directly to localStorage)
- [x] Implement opening CRUD operations in store
- [x] Implement opening set CRUD operations in store
- [x] Implement progress tracking in store
- [x] Build PGN parser utility (parse PGN string -> Opening objects)
- [x] Create pre-loaded openings data file with all listed openings

## 3. Navigation & Routing

- [x] Install react-router-dom
- [x] Set up routes: Library, Sets, Train Setup, Train Board, Stats
- [x] Build bottom nav bar component with active state
- [x] Build header component with hamburger menu

## 4. Library Screen

- [x] Opening list component with color dot, tags, progress bar
- [x] Filter controls: color toggle, tag filter, search input
- [x] Import modal: paste PGN or upload .pgn file
- [x] Edit opening modal: rename, re-tag, delete
- [x] Wire up to Zustand store

## 5. Opening Sets Screen

- [x] Set list component
- [x] Create/edit set modal with opening multi-select
- [x] Delete set functionality
- [x] Wire up to Zustand store

## 6. Train Setup Screen

- [x] Color picker (play as white/black)
- [x] Selection mode: single opening, set, by color, all, by tag
- [x] Opening/set browser within setup
- [x] "Start Training" button that navigates to Train Board

## 7. Train Board Screen

- [x] Render react-chessboard with correct orientation
- [x] Integrate chess.js for legal move validation
- [x] Build opening tree structure from selected openings for position lookup
- [x] Implement opponent auto-play (random valid continuation from tree)
- [x] Correct move: green highlight + continue
- [x] Wrong move: red X overlay, show correct move(s) with arrows + notation
- [x] "Try Again" (from mistake) and "Next Opening" buttons
- [x] Opening completed: success animation, save progress
- [x] Move list / status display below board
- [x] Optional hint system (highlight after N seconds inactivity)

## 8. Stats Screen

- [x] Dashboard: openings sorted by needs-practice
- [x] Per-opening stats: attempts, success rate, furthest move, last practiced
- [x] Reset progress per-opening and global

## 9. PWA & Polish

- [x] Configure service worker for full offline caching
- [x] PWA manifest: icons, theme color, display standalone
- [ ] Test install flow on Android
- [x] Responsive/mobile-first pass on all screens
- [x] Smooth piece animations and move highlights
- [x] Touch-friendly drag and tap on mobile
