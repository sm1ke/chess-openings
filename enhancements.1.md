# Enhancement 1: Replace Unicode Navigation Icons with Proper Icons

## Problem
On mobile, unicode characters used as buttons (← → ↩ ▶ ⏸) render poorly — inconsistent size, weight, and appearance across Android/iOS.

## Affected buttons
| Button | Current | Location |
|---|---|---|
| Reset to start | ↩ | Review board step-through controls |
| Previous move | ← | Review board step-through controls |
| Next move | → | Review board step-through controls |
| Play / auto-play | ▶ | Review board step-through controls |
| Pause | ⏸ | Review board step-through controls |
| Back (navigation) | ← Back | Review & train screens |

## Recommended approach
Use inline SVG icons — no extra dependency, renders identically on all platforms.

Suggested icon set: **Lucide** (MIT licensed, clean, consistent stroke width)
- `SkipBack` → reset to start
- `ChevronLeft` → previous move
- `ChevronRight` → next move
- `Play` → auto-play
- `Pause` → pause
- `ArrowLeft` → back navigation button

## Implementation notes
- Install `lucide-react` (`npm i lucide-react`) — tree-shakeable, adds minimal bundle size
- Replace each unicode character button with the corresponding `<Icon size={18} />` component
- Ensure icon color inherits from button `color` CSS var
- Affected files: `src/screens/ReviewBoardScreen.tsx`
