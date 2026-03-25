import { parsePgn } from '../utils/parsePgn'
import type { Opening } from '../types'

const raw: { pgn: string; color: 'white' | 'black'; description: string }[] = [
  // White standard
  {
    color: 'white',
    description: `**Why it's good:** The Giuoco Piano is one of the oldest and most natural openings. You control the center immediately with pawns on e4 and d4, develop all pieces to active squares, and castle quickly. The position is rich in tactical possibilities — the c4 bishop eyes the vulnerable f7 square and the center can explode open at any moment.\n\n**Why it's tricky:** Black has solid responses and the position can become very theoretical. If you don't know the key ideas after d4, you can easily drift into a passive position.\n\n**Long-term goals:** Push d4 to open the center, use the Re1 pin on the e-file, and launch a kingside attack. The bishop pair and open diagonals give you long-term pressure. Aim to trade off Black's defensive pieces and expose the king.`,
    pgn: `[Event "Italian Game: Giuoco Piano"]
[Opening "Italian Game: Giuoco Piano"]
1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4 exd4 6. cxd4 Bb4+ 7. Nc3 Nxe4 8. O-O Bxc3 9. d5 Bf6 10. Re1 Ne7 11. Rxe4 d6 12. Bg5`,
  },
  {
    color: 'white',
    description: `**Why it's good:** The Ruy Lopez is the gold standard of 1.e4 openings — it's been played at the highest level for centuries. By attacking the Nc6 that defends e5, you create long-term structural pressure without committing early. White consistently gets a slight but enduring edge.\n\n**Why it's tricky:** The mainline is deeply theoretical. Black has dozens of solid systems (Marshall, Breyer, Zaitsev, Berlin) and you need to know the ideas in each. Results can take a very long time to materialise — patience is essential.\n\n**Long-term goals:** Force weaknesses in Black's queenside pawn structure. After the position closes, expand on the queenside with a4-b4 or push d4-d5 to cramp Black. In endgames, White's superior pawn structure often decides the game.`,
    pgn: `[Event "Ruy Lopez: Mainline"]
[Opening "Ruy Lopez"]
1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Na5 10. Bc2 c5 11. d4`,
  },
  {
    color: 'white',
    description: `**Why it's good:** The Queen's Gambit is the most principled 1.d4 opening. You offer a pawn to gain central control — and if Black accepts, you can immediately reclaim it while White develops freely. It leads to rich strategic battles and is reliable at every level.\n\n**Why it's tricky:** Black doesn't have to accept. The Queen's Gambit Declined gives Black a very solid game, and White must know the plans for multiple Black setups. Breakthroughs require careful preparation.\n\n**Long-term goals:** Control the d5 square and restrict Black's pieces. After the center opens, activate the bishops and rooks along the central files. In the endgame, White's space advantage and bishop pair tend to be decisive.`,
    pgn: `[Event "Queen's Gambit: Mainline"]
[Opening "Queen's Gambit"]
1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O 6. Nf3 h6 7. Bh4 b6 8. cxd5 Nxd5 9. Bxe7 Qxe7`,
  },
  {
    color: 'white',
    description: `**Why it's good:** The English Opening is supremely flexible. By starting with 1.c4, you control d5 without immediately committing your central pawns, leaving lots of transposition options. It's very hard for Black to develop an aggressive response and it can transpose into Ruy Lopez, King's Indian, or Nimzo structures.\n\n**Why it's tricky:** Requires a broad strategic understanding — there's no one forcing plan. White can drift without direction if the underlying ideas aren't clear.\n\n**Long-term goals:** Control the d5 square from c4, then support with d3-d4 for a full center. Use the fianchettoed g2 bishop to dominate the long diagonal. In the middlegame, look for the d4 pawn break to open the game in your favour.`,
    pgn: `[Event "English Opening"]
[Opening "English Opening"]
1. c4 e5 2. Nc3 Nf6 3. Nf3 Nc6 4. g3 d5 5. cxd5 Nxd5 6. Bg2 Nb6 7. O-O Be7 8. d3`,
  },
  // White gambits
  {
    color: 'white',
    description: `**Why it's good:** The King's Gambit is one of the most aggressive openings in chess. By sacrificing the f-pawn, White immediately grabs the center and opens the f-file for an attacking rook. Games are sharp and tactical — exactly what gambiteers love. Historically, it was the king of romantic chess.\n\n**Why it's tricky:** Modern defenses (especially the Falkbeer Counter-Gambit and 2...d5) are very well prepared. At top level, Black can hold with precise play. You must be comfortable in imbalanced, tactical positions.\n\n**Long-term goals:** Use the open f-file and central pawn mass to launch a violent kingside attack. Get your pieces out fast and keep the initiative at all costs — in the King's Gambit, the attacker who hesitates loses. Aim for checkmate, not material equality.`,
    pgn: `[Event "King's Gambit"]
[Opening "King's Gambit"]
1. e4 e5 2. f4 exf4 3. Nf3 g5 4. h4 g4 5. Ne5 Nf6 6. Bc4 d5 7. exd5 Bd6 8. d4 Nh5`,
  },
  {
    color: 'white',
    description: `**Why it's good:** The Evans Gambit injects aggression into the Italian Game. By sacrificing the b-pawn, White seizes the center with tempo and gains a massive lead in development. Morphy and Kasparov have used it to destroy strong opposition. The attacking possibilities are explosive.\n\n**Why it's tricky:** Black can decline with 4...Bb6 and get a solid game. If Black accepts and plays accurately, White's compensation is more positional than forcing — you need good technique to convert.\n\n**Long-term goals:** Build a dominant pawn center with c3 and d4, forcing Black's bishop to waste moves. Use the development advantage to launch a kingside attack before Black can consolidate. Control the center and open lines toward Black's king.`,
    pgn: `[Event "Evans Gambit"]
[Opening "Evans Gambit"]
1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Ba5 6. d4 exd4 7. O-O dxc3 8. Qb3 Qe7 9. Nxc3`,
  },
  {
    color: 'white',
    description: `**Why it's good:** The Smith-Morra is a fantastic weapon against the Sicilian at club level. Instead of entering mountains of Sicilian theory, you sacrifice a pawn to get rapid development and open files against Black's king. Most Sicilian players are unprepared for it and can quickly get crushed.\n\n**Why it's tricky:** Black can simply decline with 2...d3 and White gets nothing. At higher levels, Black knows the defensive setups and White's compensation is objectively questionable. It's a surprise weapon, not a mainline.\n\n**Long-term goals:** Use the open c-file and rapid development to generate threats before Black organises. The rooks on c1 and d1, combined with the Nc3-Nd5 jump, create constant tactical threats. Look for Nd5 sacrifices and f4-f5 pawn advances to expose Black's king.`,
    pgn: `[Event "Smith-Morra Gambit"]
[Opening "Smith-Morra Gambit"]
1. e4 c5 2. d4 cxd4 3. c3 dxc3 4. Nxc3 Nc6 5. Nf3 d6 6. Bc4 e6 7. O-O Nf6 8. Qe2 Be7 9. Rd1`,
  },
  // White systems
  {
    color: 'white',
    description: `**Why it's good:** The London System is the ultimate low-maintenance opening. The setup — d4, Bf4, e3, Nf3, Bd3 — works against virtually anything Black plays. You get a solid, harmonious position without needing to memorise 20 moves of theory. Perfect for players who want reliability over complexity.\n\n**Why it's tricky:** It's not very ambitious. Experienced players know how to achieve easy equality against it, and White's winning chances are limited against best play. You must understand the positional ideas to make progress.\n\n**Long-term goals:** Build a solid pawn structure, then push for a kingside attack with Ne5 and f4. The Bd3 aims at h7, and piece coordination (Qd3 or Qf3) creates kingside threats. In quieter lines, focus on the c5 pawn break or a later e4 push to seize central space.`,
    pgn: `[Event "London System"]
[Opening "London System"]
1. d4 d5 2. Bf4 Nf6 3. e3 e6 4. Nf3 c5 5. c3 Nc6 6. Nbd2 Bd6 7. Bg3 O-O 8. Bd3 b6 9. O-O Bb7`,
  },
  {
    color: 'white',
    description: `**Why it's good:** The King's Indian Attack is a system rather than an opening — you play Nf3, g3, Bg2, d3, Nbd2, and e4 regardless of what Black does. Fischer used it to devastating effect. The g2 bishop is a long-term monster and the kingside attack with f4-f5 is very dangerous.\n\n**Why it's tricky:** Black can choose many setups and White's position can look passive initially. You need to know when and how to strike — premature action can leave you worse.\n\n**Long-term goals:** Build the e4-d3 pawn center, then unleash the kingside attack with f4-f5. The Nf3-h4-f5 manoeuvre and g4-g5 push are typical. The g2 bishop becomes devastating once the center is closed and Black's position is cramped.`,
    pgn: `[Event "King's Indian Attack"]
[Opening "King's Indian Attack"]
1. Nf3 d5 2. g3 Nf6 3. Bg2 e6 4. O-O Be7 5. d3 O-O 6. Nbd2 c5 7. e4 Nc6 8. Re1 dxe4 9. dxe4`,
  },
  // Black standard
  {
    color: 'black',
    description: `**Why it's good:** The Najdorf is the most ambitious response to 1.e4 — it's been the weapon of choice for Fischer, Kasparov, and Carlsen. Black immediately creates queenside counterplay while keeping maximum flexibility. The a6 move prevents Bb5 and prepares ...b5, giving Black dynamic play on both sides.\n\n**Why it's tricky:** It's deeply theoretical and extremely sharp. One mistake in the mainlines (English Attack, Bg5 variation) can be fatal. You need extensive preparation and must be comfortable in complex tactical battles.\n\n**Long-term goals:** Launch queenside counterplay with ...b5-b4 to attack White's center. In many lines, Black's queenside play races against White's kingside attack — speed matters. The active piece play and pawn breaks (...d5, ...e5) give Black genuine winning chances.`,
    pgn: `[Event "Sicilian Najdorf"]
[Opening "Sicilian Najdorf"]
1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Be7 8. Qf3 Qc7 9. O-O-O Nbd7`,
  },
  {
    color: 'black',
    description: `**Why it's good:** The French Defense is solid and principled. Black immediately contests the center with ...e6 and ...d5 and gets a very stable position. The structure leads to rich strategic play with clear plans for both sides. It's famously reliable — once Black knows the pawn structures, the plans become second nature.\n\n**Why it's tricky:** The c8 bishop is often restricted behind the pawn chain and can be a long-term weakness. White gets good kingside space and attacking chances. Black's position can feel cramped if you don't know the freeing moves.\n\n**Long-term goals:** Free the game with ...c5 (attacking d4) or ...f6 (attacking e5). Once the light-squared bishop is activated, Black's position opens up. In the endgame, the solid pawn structure and active pieces compensate for the earlier passivity.`,
    pgn: `[Event "French Defense: Mainline"]
[Opening "French Defense"]
1. e4 e6 2. d4 d5 3. Nc3 Nf6 4. Bg5 Be7 5. e5 Nfd7 6. Bxe7 Qxe7 7. f4 O-O 8. Nf3 c5 9. dxc5`,
  },
  {
    color: 'black',
    description: `**Why it's good:** The Caro-Kann is one of the soundest responses to 1.e4. Black develops the c8 bishop outside the pawn chain (unlike the French) and achieves a very solid structure. Tal famously hated playing against it — it's just too solid. Great for players who prefer structural soundness over early tactics.\n\n**Why it's tricky:** Black can be slightly passive in the early middlegame, and White keeps more space. You need to be patient and know the right moment to activate.\n\n**Long-term goals:** After the early piece exchanges, Black gets a healthy pawn structure and active pieces. The key plan is activating the bishop pair and playing ...c5 or ...e5 at the right moment. Black's endgames are typically very comfortable due to the healthy pawn structure.`,
    pgn: `[Event "Caro-Kann: Mainline"]
[Opening "Caro-Kann"]
1. e4 c6 2. d4 d5 3. Nc3 dxe4 4. Nxe4 Bf5 5. Ng3 Bg6 6. h4 h6 7. Nf3 Nd7 8. h5 Bh7 9. Bd3 Bxd3 10. Qxd3 e6 11. Bf4`,
  },
  {
    color: 'black',
    description: `**Why it's good:** The QGD Orthodox is one of the most classical and reliable defenses in chess. Black accepts a slightly passive position in exchange for rock-solid structure. The resulting positions are deeply strategic — Black's pieces find good squares and the position is very hard to crack.\n\n**Why it's tricky:** White keeps a persistent space advantage and Black must be precise to avoid being slowly squeezed. The c8 bishop can be problematic before ...dxc4 or ...c5 frees the game.\n\n**Long-term goals:** Break free with ...dxc4 and ...c5 or ...e5 to activate the pieces. Once the bishops are activated, Black's position is fully equal. Look for the ...Nd5 manoeuvre to centralise pieces and create counterplay against White's center.`,
    pgn: `[Event "QGD Orthodox"]
[Opening "QGD Orthodox"]
1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O 6. Nf3 Nbd7 7. Rc1 c6 8. Bd3 dxc4 9. Bxc4 Nd5`,
  },
  // Black gambits
  {
    color: 'black',
    description: `**Why it's good:** The Benko Gambit is a long-term strategic investment. By sacrificing a pawn early, Black obtains permanent queenside pressure with open a and b files. White is often tied to defending the extra pawn while Black's rooks dominate the queenside. It's extremely unpleasant to face if you're not prepared.\n\n**Why it's tricky:** Black is objectively down a pawn and the compensation is positional rather than immediate. Patience is required — the pressure builds over many moves. If White defends accurately and consolidates, Black may not have enough.\n\n**Long-term goals:** Seize the open a and b files with Ra8 and Rb8, creating permanent queenside threats. Use the fianchettoed bishop on g7 to dominate the long diagonal. In the endgame, the queenside pawn majority and active pieces often outweigh White's extra pawn.`,
    pgn: `[Event "Benko Gambit"]
[Opening "Benko Gambit"]
1. d4 Nf6 2. c4 c5 3. d5 b5 4. cxb5 a6 5. bxa6 Bxa6 6. Nc3 d6 7. e4 Bxf1 8. Kxf1 g6 9. Nf3 Bg7`,
  },
  {
    color: 'black',
    description: `**Why it's good:** The Budapest Gambit is a sharp and underrated weapon against 1.d4. After 2...e5, Black immediately counterattacks and forces White out of their comfort zone. If White plays greedily, Black gets a powerful initiative with pieces swarming toward White's king.\n\n**Why it's tricky:** With accurate play, White can simply return the pawn with a comfortable position. It's more of a surprise weapon than an objectively equal system. At higher levels, experienced players know the refutations.\n\n**Long-term goals:** After winning back the gambit pawn, Black aims for active piece play with the bishops and knights aiming at White's kingside. The key themes are ...Ng4 threats, bishop activity, and keeping the initiative. Don't give White time to consolidate.`,
    pgn: `[Event "Budapest Gambit"]
[Opening "Budapest Gambit"]
1. d4 Nf6 2. c4 e5 3. dxe5 Ng4 4. Nf3 Bc5 5. e3 Nc6 6. Be2 Ngxe5 7. Nxe5 Nxe5 8. O-O d6`,
  },
  // Black tricks
  {
    color: 'black',
    description: `**Why it's good:** The Stafford Gambit is a deadly practical weapon at club level. Black sacrifices a pawn for blistering development and aims straight for the throat. If White plays naturally, they walk into checkmate traps that are almost impossible to see over the board for the first time. It's a psychological weapon as much as a chess one.\n\n**Why it's tricky:** Objectively, the Stafford is refuted — White can get a large advantage with the right moves. If your opponent knows the correct response (d4, giving back material), you get nothing. It relies heavily on opponent ignorance.\n\n**Long-term goals:** The entire goal is speed — get the bishops and queen active before White knows what's happening. Target f2 and g2 with Bc5 and Qe7 threatening Qxe4+. The main trap ends in checkmate or winning White's queen. If White avoids the traps, try to maintain piece activity and look for tactical shots.`,
    pgn: `[Event "Stafford Gambit"]
[Opening "Stafford Gambit"]
1. e4 e5 2. Nf3 Nf6 3. Nxe5 Nc6 4. Nxc6 dxc6 5. d3 Bc5 6. Be2 h5 7. O-O Ng4 8. h3 Bxf2+ 9. Rxf2 Nxf2 10. Kxf2 Qd4+`,
  },
  {
    color: 'black',
    description: `**Why it's good:** The Englund Gambit Trap is one of the most lethal traps in chess — if White takes the bait, the game ends in checkmate in just 8 moves. It's a brilliant surprise weapon in quick games and is completely unexpected from the opening moves.\n\n**Why it's tricky:** It's one of the most dubious openings in chess. Any player who knows the refutation (simply declining or playing d5) gets a completely winning position. It has zero practical value against prepared opponents and almost no strategic depth — it's purely a trap.\n\n**Long-term goals:** The entire point is the one trap. After 1.d4 e5 2.dxe5 Nc6 3.Nf3 Qe7, White has already fallen slightly behind. If they grab with 4.Bf4??, Black wins the queen with Qb4+. Use it in blitz or against unsuspecting opponents, but don't rely on it as a serious opening.`,
    pgn: `[Event "Englund Gambit Trap"]
[Opening "Englund Gambit Trap"]
1. d4 e5 2. dxe5 Nc6 3. Nf3 Qe7 4. Bf4 Qb4+ 5. Bd2 Qxb2 6. Bc3 Bb4 7. Qd2 Bxc3 8. Qxc3 Qc1#`,
  },
  {
    color: 'black',
    description: `**Why it's good:** The Elephant Gambit is a surprise weapon where Black immediately counters 1.e4 e5 2.Nf3 with 2...d5, sacrificing a pawn for rapid counterplay. If White isn't prepared, the position quickly becomes complicated and Black can seize the initiative. It's completely unexpected and difficult to handle over the board.\n\n**Why it's tricky:** Objectively, the Elephant Gambit is unsound — White gets a clear advantage with correct play (3.exd5 e4 4.Qe2!). Black's compensation is more tactical than structural and relies on White making natural-looking but inaccurate moves.\n\n**Long-term goals:** After the pawn sacrifice, aim for rapid piece activity — especially the dark-squared bishop and the queen. The Ng4 manoeuvre hitting f2 is a key motif. Keep the initiative and don't allow White to consolidate. The gambit works best when White plays too cautiously and allows Black to recover the pawn with a good position.`,
    pgn: `[Event "Elephant Gambit"]
[Opening "Elephant Gambit"]
1. e4 e5 2. Nf3 d5 3. exd5 e4 4. Qe2 Nf6 5. d3 Qxd5 6. Nd4 Bc5 7. Nb3 Bb6 8. dxe4 Nxe4`,
  },
]

let cached: Opening[] | null = null

export function getPreloadedOpenings(): Opening[] {
  if (cached) return cached
  cached = raw.flatMap(({ pgn, color, description }) => {
    const openings = parsePgn(pgn, { color })
    return openings.map((o) => ({ ...o, description }))
  })
  return cached
}
