# Enhancements

## 1. Replace unicode navigation icons with proper icons
On mobile, the ← → ↩ unicode arrows in the step-through controls look poor. Replace with proper icons (SVG or PNG assets) for: back, previous, next, reset, and play/pause buttons.

## 5. Expand opening library: 50 trick/trap openings with full content

**Step 1 — Research and list 50 trick/trap openings** (bias toward traps, tricks, gambits, and aggressive lines that punish passive or inaccurate play). Prioritise openings that:
- Have clear "gotcha" moments a beginner/intermediate would fall into
- Work against common amateur responses
- Are fun and immediately rewarding to learn

**Step 2 — For each opening, author:**
- Full description: why it's good, why it's tricky, long-term goals (same format as existing 18)
- Correct tags (`gambit`, `trick`, `system`, `standard`)
- 2–4 inaccuracy sub-lines per opening covering beginner, intermediate, and advanced opponent errors — each with:
  - The diverging move sequence
  - Why that move is a mistake
  - The correct punishing reply and the follow-up plan

**Candidate list (to be researched and confirmed):**
*White tricks/traps:*
1. Fried Liver Attack (Italian)
2. Legal's Trap (Italian/Philidor)
3. Noah's Ark Trap (Ruy Lopez)
4. Fishing Pole Trap (Ruy Lopez)
5. Mortimer Trap (Ruy Lopez)
6. Blackburne-Shilling Gambit response
7. Cochrane Gambit (Petrov)
8. Jerome Gambit
9. Traxler Counter-Attack (as White)
10. Alapin Gambit (French)
11. Wing Gambit (French)
12. Milner-Barry Gambit (French)
13. Fantasy Variation (Caro-Kann)
14. Panov-Botvinnik Attack (Caro-Kann)
15. Grand Prix Attack (Sicilian)
16. Smith-Morra sublines / traps
17. Morra Gambit declined tricks
18. Halloween Gambit (4 Knights)
19. Göring Gambit (Scotch)
20. Danish Gambit
21. Urusov Gambit
22. Ponziani Opening traps
23. Max Lange Attack
24. Two Knights: Fried Liver
25. Botvinnik System (English) traps

*Black tricks/traps:*
26. Stafford Gambit traps (extended lines)
27. Elephant Gambit traps (extended)
28. Englund Gambit traps (extended)
29. Budapest Gambit traps (extended)
30. Albin Counter-Gambit
31. Lasker Trap (Dutch)
32. Baltic Defense traps
33. Tennison Gambit refutation traps
34. Blackmar-Diemer Gambit refutation
35. Slav Defense: Winawer Countergambit
36. Benoni: Modern traps
37. Old Benoni traps
38. Benko Gambit extended lines
39. King's Indian: Sämisch trap
40. Nimzo-Indian: Spassky trap
41. Dutch: Staunton Gambit trap
42. Owen's Defense traps
43. Grob's Attack refutation
44. Fool's Mate / Scholar's Mate counters
45. Pseudo-Trompowsky traps
46. Trompowsky refutation lines
47. Catalan: Queenside tricks
48. Vienna Gambit refutation (as Black)
49. Center Game refutation
50. Latvian Gambit (aggressive Black)

---

## 4. Home screen search and filters
Add to the home/featured openings section:
- **Search box** — text input that filters openings by name in real time
- **Tag filter** — segmented toggle buttons for `standard`, `gambit`, `trick`, `system`; multiple can be selected simultaneously; selecting none shows all
- **Color filter** — toggle between All / White / Black
- All three filters compose together (AND logic)

---

## 3. Tag all preloaded openings
Currently all 18 preloaded openings have empty tags. Add correct tags at source using the existing `Tag` type (`standard | gambit | trick | system`). Also backfill tags onto existing stored openings (same backfill pattern used for descriptions).

Proposed tag assignments:
| Opening | Tags |
|---|---|
| Italian Game: Giuoco Piano | standard |
| Ruy Lopez | standard |
| Queen's Gambit | standard |
| English Opening | standard, system |
| King's Gambit | gambit |
| Evans Gambit | gambit |
| Smith-Morra Gambit | gambit |
| London System | system |
| King's Indian Attack | system |
| Sicilian Najdorf | standard |
| French Defense | standard |
| Caro-Kann | standard |
| QGD Orthodox | standard |
| Benko Gambit | gambit |
| Budapest Gambit | gambit, trick |
| Stafford Gambit | gambit, trick |
| Englund Gambit Trap | gambit, trick |
| Elephant Gambit | gambit, trick |

---

## 2. Opponent inaccuracy training ("punish bad moves")
Each opening should support a set of sub-variations where the opponent plays an inaccurate or bad move, and the user must find the correct exploit.

**Data model:**
- Each `Opening` can have an array of `Inaccuracy` variations, each with:
  - The move sequence up to the bad opponent move (diverging from the mainline at some point)
  - The bad move itself
  - A short description of why it's bad and how to exploit it
  - The correct response move(s) the user should play

**Settings toggle:**
- "Highlight opponent inaccuracies" — when on, a bad opponent move during training triggers a red/orange flash/highlight on the board and shows a sidebar blurb explaining why the move is bad and what the best reply is

**Training integration:**
- Inaccuracy lines are practiced the same way as mainlines and tracked in progress separately
- When the opponent plays a known bad move, the board highlights it (e.g. red square glow on the piece/square) and the description panel slides up
- User must then find the correct punishing reply — counted as a separate drill in progress stats

**Opponent strength levels (setting in training status bar, top-right):**
- **Stockfish** — plays engine-optimal moves every turn, no inaccuracies
- **Advanced** — plays mainline theory almost always; rarely deviates with a suboptimal move
- **Intermediate** — occasionally plays known inaccuracies; gives player opportunities to exploit
- **Beginner** — regularly plays weak or inaccurate moves drawn from the inaccuracy variation library

The level selector lives in the training board header/status bar so it can be changed mid-session.

**How opponent level affects play:**
- At Stockfish: opponent always picks from the mainline tree, no inaccuracy lines triggered
- At lower levels: after each opponent move, a dice-roll weighted by level determines whether the opponent plays the mainline best move or one of the authored inaccuracy moves for that position
  - Beginner: ~60% chance of inaccuracy when one is available
  - Intermediate: ~30%
  - Advanced: ~10%

**When an inaccuracy is played:**
- The bad move is highlighted on the board (red/orange square glow)
- A panel slides up below the board showing: why this move is bad, and a hint toward the best reply
- User must find and play the correct punishing response
- If correct: celebrated, counted in progress as a separate "exploitation" drill
- If wrong: shown the correct reply with an explanation

**Content:**
- Need to author inaccuracy variations for all 18 preloaded openings (at least 2–3 per opening)
- Each inaccuracy entry: position FEN or move sequence, bad move, explanation, correct reply move(s)
