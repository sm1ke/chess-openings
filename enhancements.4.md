# Enhancement 4: Home Screen Search and Filters

## Problem
The featured openings grid on the home screen shows a fixed set of 10 cards with no way to search or filter. As the library grows (especially after enhancement 5 adds ~50 more openings), discovery becomes impossible.

## Design

### Search box
- Text input at the top of the featured openings section
- Filters opening cards in real time by name (case-insensitive, partial match)
- Clear (×) button when text is present

### Tag filter (segmented multi-toggle)
- Row of pill buttons: `All` · `Standard` · `Gambit` · `Trick` · `System`
- Multiple tags can be active simultaneously
- When no tag is selected (or "All"), all tags shown
- Active pills use accent color background

### Color filter
- Three-way toggle: `All` · `White` · `Black`
- Single-select only

### Filter composition
All three filters apply with AND logic:
- Show openings that match the search text AND match any selected tag AND match the color filter

### Behaviour changes
- The FEATURED list becomes the FULL opening library (all openings in the store, not just the hardcoded 10)
- Grid remains 2-column
- "No results" empty state when nothing matches
- Filter state is not persisted (resets on navigation)

## Affected files
- `src/screens/HomeScreen.tsx` — add search + filter state, replace hardcoded FEATURED list with dynamic store openings
