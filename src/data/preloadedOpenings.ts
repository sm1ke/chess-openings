import { parsePgn } from '../utils/parsePgn'
import type { Opening, Inaccuracy } from '../types'

const raw: { pgn: string; color: 'white' | 'black'; description: string; inaccuracies?: Inaccuracy[] }[] = [
  // White standard
  {
    color: 'white',
    description: `**Why it's good:** The Giuoco Piano is one of the oldest and most natural openings. You control the center immediately with pawns on e4 and d4, develop all pieces to active squares, and castle quickly. The position is rich in tactical possibilities — the c4 bishop eyes the vulnerable f7 square and the center can explode open at any moment.\n\n**Why it's tricky:** Black has solid responses and the position can become very theoretical. If you don't know the key ideas after d4, you can easily drift into a passive position.\n\n**Long-term goals:** Push d4 to open the center, use the Re1 pin on the e-file, and launch a kingside attack. The bishop pair and open diagonals give you long-term pressure. Aim to trade off Black's defensive pieces and expose the king.`,
    pgn: `[Event "Italian Game: Giuoco Piano"]
[Opening "Italian Game: Giuoco Piano"]
1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4 exd4 6. cxd4 Bb4+ 7. Nc3 Nxe4 8. O-O Bxc3 9. d5 Bf6 10. Re1 Ne7 11. Rxe4 d6 12. Bg5`,
    inaccuracies: [
      {
        moves: ['e4','e5','Nf3','Nc6','Bc4','Bc5','c3','Nf6','d4','exd4','cxd4','Bb4+','Nc3','Bxc3+'],
        badMove: 'Bxc3+',
        level: 'beginner',
        explanation: 'Surrenders the bishop pair without compensation. White recaptures bxc3, building a powerful center — Black hands White a strong pawn on c3 with no material gain.',
        punishment: 'bxc3 — White obtains a powerful pawn center (c3+d4+e4). Continue O-O, e5 chasing the knight, Re1 with a dominating position.',
        punishmentMoves: ['bxc3'],
      },
      {
        moves: ['e4','e5','Nf3','Nc6','Bc4','Bc5','c3','Nf6','d4','d6'],
        badMove: 'd6',
        level: 'beginner',
        explanation: 'Instead of contesting the center with exd4, Black solidifies passively, ceding central control. The c5-bishop loses scope and Black falls behind in development.',
        punishment: 'dxe5 dxe5 Qxd8+ Kxd8 — White trades queens into a favorable endgame where Black has lost castling rights.',
        punishmentMoves: ['dxe5'],
      },
      {
        moves: ['e4','e5','Nf3','Nc6','Bc4','Bc5','c3','Nf6','d4','exd4','cxd4','Bb4+','Bd2','Nxe4'],
        badMove: 'Nxe4',
        level: 'intermediate',
        explanation: 'After 7.Bd2 Black can equalize with Bxd2+, but Nxe4 walks into a classic trap: Bxb4 Nxb4 Bxf7+ wins material.',
        punishment: 'Bxb4 Nxb4 Bxf7+! Kxf7 Qb3+ — White wins back the piece with interest, Black\'s king is displaced and cannot castle.',
        punishmentMoves: ['Bxb4'],
      },
    ],
  },
  {
    color: 'white',
    description: `**Why it's good:** The Ruy Lopez is the gold standard of 1.e4 openings — it's been played at the highest level for centuries. By attacking the Nc6 that defends e5, you create long-term structural pressure without committing early. White consistently gets a slight but enduring edge.\n\n**Why it's tricky:** The mainline is deeply theoretical. Black has dozens of solid systems (Marshall, Breyer, Zaitsev, Berlin) and you need to know the ideas in each. Results can take a very long time to materialise — patience is essential.\n\n**Long-term goals:** Force weaknesses in Black's queenside pawn structure. After the position closes, expand on the queenside with a4-b4 or push d4-d5 to cramp Black. In endgames, White's superior pawn structure often decides the game.`,
    pgn: `[Event "Ruy Lopez: Mainline"]
[Opening "Ruy Lopez"]
1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Na5 10. Bc2 c5 11. d4`,
    inaccuracies: [
      {
        moves: ['e4','e5','Nf3','Nc6','Bb5','f5'],
        badMove: 'f5',
        level: 'intermediate',
        explanation: 'The Schliemann (3...f5) weakens Black\'s kingside and the e5 pawn. After Nc3!, Black struggles to maintain both pawns and faces tactical complications favoring White.',
        punishment: 'Nc3! fxe4 Nxe4 d5 Nxe5! — White wins material; after dxe4 Nxc6 Qd5 c4!, White is up a pawn with a ruined Black structure.',
        punishmentMoves: ['Nc3'],
      },
      {
        moves: ['e4','e5','Nf3','Nc6','Bb5','a6','Ba4','Nf6','O-O','Bc5'],
        badMove: 'Bc5',
        level: 'beginner',
        explanation: 'Less accurate than 5...Be7. After c3, White prepares d4 with tempo and the c5-bishop becomes a target. Black delays castling and leaves the king exposed.',
        punishment: 'c3 b5 Bc2 d5 d4 — White strikes the center and the bishop on c5 is misplaced. White gets the better endgame with active rooks.',
        punishmentMoves: ['c3'],
      },
      {
        moves: ['e4','e5','Nf3','Nc6','Bb5','a6','Ba4','Nf6','O-O','Be7','Re1','b5','Bb3','d6','c3','Bg4'],
        badMove: 'Bg4',
        level: 'intermediate',
        explanation: 'Pinning the knight before castling is premature. h3 forces the bishop back with tempo, and White pushes d4 with a free move while Black\'s king is still in the center.',
        punishment: 'h3 Bh5 d4 — White breaks in the center. After exd4 cxd4 O-O g4! Bg6 Nxe5, White wins material exploiting the pin.',
        punishmentMoves: ['h3'],
      },
      {
        moves: ['e4','e5','Nf3','Nc6','Bb5','a6','Ba4','Nf6','O-O','Be7','Re1','b5','Bb3','d6','c3','O-O','h3','d5'],
        badMove: 'd5',
        level: 'intermediate',
        explanation: 'Premature before the Chigorin setup. After exd5 Nxd5 Nxe5 Nxe5 Rxe5, White wins a clean pawn. Black needed Na5 first to kick the bishop.',
        punishment: 'exd5 Nxd5 Nxe5! Nxe5 Rxe5 — White wins a pawn, the rook on e5 is very active.',
        punishmentMoves: ['exd5'],
      },
    ],
  },
  {
    color: 'white',
    description: `**Why it's good:** The Queen's Gambit is the most principled 1.d4 opening. You offer a pawn to gain central control — and if Black accepts, you can immediately reclaim it while White develops freely. It leads to rich strategic battles and is reliable at every level.\n\n**Why it's tricky:** Black doesn't have to accept. The Queen's Gambit Declined gives Black a very solid game, and White must know the plans for multiple Black setups. Breakthroughs require careful preparation.\n\n**Long-term goals:** Control the d5 square and restrict Black's pieces. After the center opens, activate the bishops and rooks along the central files. In the endgame, White's space advantage and bishop pair tend to be decisive.`,
    pgn: `[Event "Queen's Gambit: Mainline"]
[Opening "Queen's Gambit"]
1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O 6. Nf3 h6 7. Bh4 b6 8. cxd5 Nxd5 9. Bxe7 Qxe7`,
    inaccuracies: [
      {
        moves: ['d4','d5','c4','e6','Nc3','Nf6','Bg5','Nbd7'],
        badMove: 'Nbd7',
        level: 'beginner',
        explanation: 'Blocks the c8-bishop and makes Black\'s queenside passive. White immediately gains space with e4, and Black has no good way to free the light-squared bishop.',
        punishment: 'cxd5 exd5 e4! — White challenges immediately. After dxe4 Nxe4, White has strong center and far superior piece activity.',
        punishmentMoves: ['cxd5'],
      },
      {
        moves: ['d4','d5','c4','e6','Nc3','Nf6','Bg5','h6'],
        badMove: 'h6',
        level: 'beginner',
        explanation: 'Wastes a tempo asking the bishop to declare. White trades Bxf6 giving Black doubled f-pawns and a weakened kingside structure.',
        punishment: 'Bxf6 Qxf6 cxd5 exd5 e3 — White trades bishop for knight, gains structural advantage. Black\'s queen is awkward and White develops naturally.',
        punishmentMoves: ['Bxf6'],
      },
      {
        moves: ['d4','d5','c4','e6','Nc3','Nf6','Bg5','dxc4'],
        badMove: 'dxc4',
        level: 'intermediate',
        explanation: 'Accepting the gambit concedes the center and allows White to build with e4. The c4-pawn is hard to hold and White gets an extra tempo and broad central control.',
        punishment: 'e4! b5 a4 — White immediately stakes the center and challenges the pawn.',
        punishmentMoves: ['e4'],
      },
      {
        moves: ['d4','d5','c4','e6','Nc3','c5'],
        badMove: 'c5',
        level: 'intermediate',
        explanation: 'Slightly premature before Nf6. After cxd5 exd5 Nf3, White can target the isolated d-pawn and Black must prove piece activity compensates.',
        punishment: 'cxd5 exd5 Nf3 Nc6 g3! — White opts for a Catalan-style setup, fianchettoing the bishop to pressure d5.',
        punishmentMoves: ['cxd5'],
      },
    ],
  },
  {
    color: 'white',
    description: `**Why it's good:** The English Opening is supremely flexible. By starting with 1.c4, you control d5 without immediately committing your central pawns, leaving lots of transposition options. It's very hard for Black to develop an aggressive response and it can transpose into Ruy Lopez, King's Indian, or Nimzo structures.\n\n**Why it's tricky:** Requires a broad strategic understanding — there's no one forcing plan. White can drift without direction if the underlying ideas aren't clear.\n\n**Long-term goals:** Control the d5 square from c4, then support with d3-d4 for a full center. Use the fianchettoed g2 bishop to dominate the long diagonal. In the middlegame, look for the d4 pawn break to open the game in your favour.`,
    pgn: `[Event "English Opening"]
[Opening "English Opening"]
1. c4 e5 2. Nc3 Nf6 3. Nf3 Nc6 4. g3 d5 5. cxd5 Nxd5 6. Bg2 Nb6 7. O-O Be7 8. d3`,
    inaccuracies: [
      {
        moves: ['c4','e5','Nc3','Nf6','Nf3','e4'],
        badMove: 'e4',
        level: 'beginner',
        explanation: 'Pushing e4 too early before development. The pawn becomes a target after Ng5!, and Black must defend awkwardly or allow material loss.',
        punishment: 'Ng5! Qe7 d3! — White attacks e4. After exd3 Nxf7! Kxf7 Qxd3+, White wins material and Black\'s king is exposed.',
        punishmentMoves: ['Ng5'],
      },
      {
        moves: ['c4','e5','Nc3','d6'],
        badMove: 'd6',
        level: 'beginner',
        explanation: 'Extremely passive — concedes the center entirely. White sets up an ideal broad pawn center with d4 and e4, and Black has no counterplay.',
        punishment: 'd4 exd4 Qxd4 Nc6 Qd2 — White maintains the center and develops freely with dominant bishops.',
        punishmentMoves: ['d4'],
      },
      {
        moves: ['c4','c5','Nc3','Nc6','Nf3','e5','g3','d6','Bg2','Be6'],
        badMove: 'Be6',
        level: 'intermediate',
        explanation: 'Premature bishop development. After Ng5, the bishop is attacked and must move again. Black loses two tempos and White gains a clear initiative targeting f7.',
        punishment: 'Ng5! Bg4 f3! Bh5 d3 — White gains space and time. After O-O, significant pressure on f7 weakness and Black\'s underdevelopment.',
        punishmentMoves: ['Ng5'],
      },
      {
        moves: ['c4','Nf6','Nc3','e5','Nf3','Nc6','d4','exd4','Nxd4','Bb4'],
        badMove: 'Bb4',
        level: 'intermediate',
        explanation: 'The pin is ineffective here. After Nxc6 bxc6 Bg5, the bishop on b4 is not well placed and Black\'s doubled c-pawns are a long-term weakness.',
        punishment: 'Nxc6 bxc6 Bg5! — White exploits the pin on f6 and the weak c6-pawn. After Qe7 e3, White\'s bishops dominate.',
        punishmentMoves: ['Nxc6'],
      },
    ],
  },
  // White gambits
  {
    color: 'white',
    description: `**Why it's good:** The King's Gambit is one of the most aggressive openings in chess. By sacrificing the f-pawn, White immediately grabs the center and opens the f-file for an attacking rook. Games are sharp and tactical — exactly what gambiteers love. Historically, it was the king of romantic chess.\n\n**Why it's tricky:** Modern defenses (especially the Falkbeer Counter-Gambit and 2...d5) are very well prepared. At top level, Black can hold with precise play. You must be comfortable in imbalanced, tactical positions.\n\n**Long-term goals:** Use the open f-file and central pawn mass to launch a violent kingside attack. Get your pieces out fast and keep the initiative at all costs — in the King's Gambit, the attacker who hesitates loses. Aim for checkmate, not material equality.`,
    pgn: `[Event "King's Gambit"]
[Opening "King's Gambit"]
1. e4 e5 2. f4 exf4 3. Nf3 g5 4. h4 g4 5. Ne5 Nf6 6. Bc4 d5 7. exd5 Bd6 8. d4 Nh5`,
    inaccuracies: [
      {
        moves: ['e4','e5','f4','exf4','Nf3','g5'],
        badMove: 'g5',
        level: 'beginner',
        explanation: 'Defending the f4-pawn with g5 weakens f5, h5 and the entire kingside. After h4! g4 Ne5, Black faces massive kingside weaknesses and the king can never reach safety.',
        punishment: 'h4! g4 Ne5 Nf6 Bc4! — White develops rapidly, ignoring the g-pawn. After d5 exd5 O-O!, White has a crushing attack.',
        punishmentMoves: ['h4'],
      },
      {
        moves: ['e4','e5','f4','d5'],
        badMove: 'd5',
        level: 'intermediate',
        explanation: 'The Falkbeer Counter-Gambit is risky without preparation. After e5!, Black\'s center is blocked and the f4 pawn is preserved with a space advantage.',
        punishment: 'e5! c5 Nf3 Nc6 c3 — White has a solid space advantage and Black\'s central break is neutralized.',
        punishmentMoves: ['e5'],
      },
      {
        moves: ['e4','e5','f4','exf4','Nf3','d6'],
        badMove: 'd6',
        level: 'beginner',
        explanation: 'Passive defense — does nothing to contest White\'s strong center. White builds with d4 and e5 gaining large amounts of space. Black cannot develop the c8-bishop easily.',
        punishment: 'd4 g5 h4! — Even if Black tries to hold the pawn, White launches the attack. After g4 Ng5 f5 exf5 Be2, White has overwhelming development.',
        punishmentMoves: ['d4'],
      },
      {
        moves: ['e4','e5','f4','Bc5','Nf3','d6','Bc4','Nf6','d3','Nc6','O-O','Bg4'],
        badMove: 'Bg4',
        level: 'intermediate',
        explanation: 'The pin looks natural but White plays c3 and b4!, attacking the bishop and gaining queenside space. The pin is ineffective since d3 and c3 control the center.',
        punishment: 'c3! Bb6 b4! — White gains queenside space and the bishop on g4 is misplaced. After a6 fxe5 Nxe5 Nxe5 dxe5 Bxg4, White wins material.',
        punishmentMoves: ['c3'],
      },
    ],
  },
  {
    color: 'white',
    description: `**Why it's good:** The Evans Gambit injects aggression into the Italian Game. By sacrificing the b-pawn, White seizes the center with tempo and gains a massive lead in development. Morphy and Kasparov have used it to destroy strong opposition. The attacking possibilities are explosive.\n\n**Why it's tricky:** Black can decline with 4...Bb6 and get a solid game. If Black accepts and plays accurately, White's compensation is more positional than forcing — you need good technique to convert.\n\n**Long-term goals:** Build a dominant pawn center with c3 and d4, forcing Black's bishop to waste moves. Use the development advantage to launch a kingside attack before Black can consolidate. Control the center and open lines toward Black's king.`,
    pgn: `[Event "Evans Gambit"]
[Opening "Evans Gambit"]
1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Ba5 6. d4 exd4 7. O-O dxc3 8. Qb3 Qe7 9. Nxc3`,
    inaccuracies: [
      {
        moves: ['e4','e5','Nf3','Nc6','Bc4','Bc5','b4','Bb6'],
        badMove: 'Bb6',
        level: 'beginner',
        explanation: 'Declining with Bb6 is passive. White plays a4! threatening a5, gaining queenside space for free. The bishop on b6 is inactive.',
        punishment: 'a4! a5 b5 Nd4 Nxd4 Bxd4 c3! — White forces the bishop back and gains central control with d4.',
        punishmentMoves: ['a4'],
      },
      {
        moves: ['e4','e5','Nf3','Nc6','Bc4','Bc5','b4','Bxb4','c3','Bc5'],
        badMove: 'Bc5',
        level: 'beginner',
        explanation: 'Worse than Ba5. After d4 exd4 cxd4 Bb6 d5!, White pushes through the center with an overwhelming initiative.',
        punishment: 'd4! exd4 cxd4 Bb6 d5! — White\'s passed d-pawn and development advantage are overwhelming.',
        punishmentMoves: ['d4'],
      },
      {
        moves: ['e4','e5','Nf3','Nc6','Bc4','Bc5','b4','Bxb4','c3','Ba5','d4','exd4','O-O','d6'],
        badMove: 'd6',
        level: 'intermediate',
        explanation: 'Too slow. White has a powerful initiative after castling — Black needs to return the pawn with dxc3 or develop with Nge7. With d6, White attacks immediately.',
        punishment: 'cxd4 Bb6 Nc3 Na5 Bg5! — White pins the f6-knight and creates immediate threats. After f6 d5, White\'s space advantage is decisive.',
        punishmentMoves: ['cxd4'],
      },
      {
        moves: ['e4','e5','Nf3','Nc6','Bc4','Bc5','b4','Bxb4','c3','Ba5','d4','exd4','O-O','O-O'],
        badMove: 'O-O',
        level: 'intermediate',
        explanation: 'Castling immediately allows a direct kingside attack. The f7 square becomes a target and Black\'s king is less safe than in the center.',
        punishment: 'cxd4 d5 exd5 Nxd5 Nxd5 Qxd5 Qb3! — White wins material; the queen attacks d5 and f7 simultaneously.',
        punishmentMoves: ['cxd4'],
      },
    ],
  },
  {
    color: 'white',
    description: `**Why it's good:** The Smith-Morra is a fantastic weapon against the Sicilian at club level. Instead of entering mountains of Sicilian theory, you sacrifice a pawn to get rapid development and open files against Black's king. Most Sicilian players are unprepared for it and can quickly get crushed.\n\n**Why it's tricky:** Black can simply decline with 2...d3 and White gets nothing. At higher levels, Black knows the defensive setups and White's compensation is objectively questionable. It's a surprise weapon, not a mainline.\n\n**Long-term goals:** Use the open c-file and rapid development to generate threats before Black organises. The rooks on c1 and d1, combined with the Nc3-Nd5 jump, create constant tactical threats. Look for Nd5 sacrifices and f4-f5 pawn advances to expose Black's king.`,
    pgn: `[Event "Smith-Morra Gambit"]
[Opening "Smith-Morra Gambit"]
1. e4 c5 2. d4 cxd4 3. c3 dxc3 4. Nxc3 Nc6 5. Nf3 d6 6. Bc4 e6 7. O-O Nf6 8. Qe2 Be7 9. Rd1`,
    inaccuracies: [
      {
        moves: ['e4','c5','d4','cxd4','c3','d5'],
        badMove: 'd5',
        level: 'beginner',
        explanation: 'A popular beginner counter-gambit but leads to an exposed queen after exd5 Qxd5 cxd4. White attacks the queen with Nc3 and maintains a superior center.',
        punishment: 'exd5 Qxd5 cxd4! cxd4 Nc3! — White attacks the queen with tempo. After Qa5 Nf3 Nf6 Bd3, White\'s development is far superior.',
        punishmentMoves: ['exd5'],
      },
      {
        moves: ['e4','c5','d4','cxd4','c3','dxc3','Nxc3','Nc6','Nf3','e5'],
        badMove: 'e5',
        level: 'beginner',
        explanation: 'Closes the center and blocks d6. The bishop on c4 eyes f7, and with Ng5 threats, Black cannot complete development. The e5-pawn can also become a target for d5.',
        punishment: 'Bc4! Be7 O-O Nf6 Nd5! — White immediately exploits the weak d5-square. After Nxd5 exd5 Nd4 exd4 Qh5!, White has a strong attack.',
        punishmentMoves: ['Bc4'],
      },
      {
        moves: ['e4','c5','d4','cxd4','c3','dxc3','Nxc3','Nc6','Nf3','d6','Bc4','e6','O-O','a6'],
        badMove: 'a6',
        level: 'intermediate',
        explanation: 'A waste of tempo. White immediately exploits the lag in development with Qe2 followed by Rd1, building pressure on d6. Black should be developing pieces.',
        punishment: 'Qe2! Nge7 Rd1 — White threatens e5 and the pressure on d6 is immediate. After Ng6 Bf4 Be7 Rac1, White has tremendous piece activity.',
        punishmentMoves: ['Qe2'],
      },
      {
        moves: ['e4','c5','d4','cxd4','c3','dxc3','Nxc3','Nc6','Nf3','d6','Bc4','Nf6','O-O','Nxe4'],
        badMove: 'Nxe4',
        level: 'beginner',
        explanation: 'Grabbing the e4-pawn is a serious error. Bxf7+! Kxf7 Qd5+ forks king and knight — Black loses material and the king is permanently exposed.',
        punishment: 'Bxf7+! Kxf7 Qd5+ Ke8 Re1 — White wins back the piece with interest. After Ne5 Rxe4 Nxf3+ gxf3, White has a material advantage.',
        punishmentMoves: ['Bxf7+'],
      },
    ],
  },
  // White systems
  {
    color: 'white',
    description: `**Why it's good:** The London System is the ultimate low-maintenance opening. The setup — d4, Bf4, e3, Nf3, Bd3 — works against virtually anything Black plays. You get a solid, harmonious position without needing to memorise 20 moves of theory. Perfect for players who want reliability over complexity.\n\n**Why it's tricky:** It's not very ambitious. Experienced players know how to achieve easy equality against it, and White's winning chances are limited against best play. You must understand the positional ideas to make progress.\n\n**Long-term goals:** Build a solid pawn structure, then push for a kingside attack with Ne5 and f4. The Bd3 aims at h7, and piece coordination (Qd3 or Qf3) creates kingside threats. In quieter lines, focus on the c5 pawn break or a later e4 push to seize central space.`,
    pgn: `[Event "London System"]
[Opening "London System"]
1. d4 d5 2. Bf4 Nf6 3. e3 e6 4. Nf3 c5 5. c3 Nc6 6. Nbd2 Bd6 7. Bg3 O-O 8. Bd3 b6 9. O-O Bb7`,
    inaccuracies: [
      {
        moves: ['d4','d5','Bf4','c5'],
        badMove: 'c5',
        level: 'beginner',
        explanation: 'Looks active but allows White to simply play e3 and maintain the setup. After cxd4 exd4, White has a solid broad center and the Bf4 is well-placed.',
        punishment: 'e3! Nc6 Nf3 cxd4 exd4 — White maintains a solid, broad center. After Bd3 Nf6 O-O, White has an ideal setup.',
        punishmentMoves: ['e3'],
      },
      {
        moves: ['d4','d5','Bf4','Nf6','e3','Bg4'],
        badMove: 'Bg4',
        level: 'beginner',
        explanation: 'Pins the knight before White has even played it. After h3, the bishop must retreat and has wasted two tempos.',
        punishment: 'h3! Bxf3 Qxf3 — White gladly exchanges to get the queen to f3, eyeing b7 and controlling the center. After e6 Nd2 Bd6 Bxd6 Qxd6 g3, White has a clean position.',
        punishmentMoves: ['h3'],
      },
      {
        moves: ['d4','d5','Bf4','Nf6','e3','e6','Nf3','Nc6'],
        badMove: 'Nc6',
        level: 'intermediate',
        explanation: 'Blocks the c7-pawn, preventing the freeing move ...c5. Black cannot challenge White\'s center and the knight on c6 has no good squares.',
        punishment: 'c3! Bd6 Bxd6 Qxd6 Nbd2 O-O Bd3 — White achieves the ideal London setup. After O-O, White will play e4 at the right moment.',
        punishmentMoves: ['c3'],
      },
      {
        moves: ['d4','d5','Bf4','f6'],
        badMove: 'f6',
        level: 'beginner',
        explanation: 'A serious mistake. Weakens e6 and the kingside irreparably, blocks the f6-knight from its ideal square. This move has no real justification.',
        punishment: 'e3 e5 dxe5 fxe5 Bxe5! — White immediately exploits the f6 weakness. After Nf6 Bg3, White is a pawn up with the better position.',
        punishmentMoves: ['e3'],
      },
    ],
  },
  {
    color: 'white',
    description: `**Why it's good:** The King's Indian Attack is a system rather than an opening — you play Nf3, g3, Bg2, d3, Nbd2, and e4 regardless of what Black does. Fischer used it to devastating effect. The g2 bishop is a long-term monster and the kingside attack with f4-f5 is very dangerous.\n\n**Why it's tricky:** Black can choose many setups and White's position can look passive initially. You need to know when and how to strike — premature action can leave you worse.\n\n**Long-term goals:** Build the e4-d3 pawn center, then unleash the kingside attack with f4-f5. The Nf3-h4-f5 manoeuvre and g4-g5 push are typical. The g2 bishop becomes devastating once the center is closed and Black's position is cramped.`,
    pgn: `[Event "King's Indian Attack"]
[Opening "King's Indian Attack"]
1. Nf3 d5 2. g3 Nf6 3. Bg2 e6 4. O-O Be7 5. d3 O-O 6. Nbd2 c5 7. e4 Nc6 8. Re1 dxe4 9. dxe4`,
    inaccuracies: [
      {
        moves: ['Nf3','d5','g3','Nf6','Bg2','c6','O-O','Bg4'],
        badMove: 'Bg4',
        level: 'beginner',
        explanation: 'Pins the f3-knight but White ignores it and plays d3, h3 later. The bishop on g4 is premature — Black should complete development with e6, Nbd7, Be7 first.',
        punishment: 'd3! Nbd7 Nbd2 e5 h3! Bh5 e4! — White strikes the center and the bishop on h5 is offside. After dxe4 dxe4, White has a strong center.',
        punishmentMoves: ['d3'],
      },
      {
        moves: ['Nf3','d5','g3','Nf6','Bg2','c6','O-O','e5','d3','Bc5'],
        badMove: 'Bc5',
        level: 'intermediate',
        explanation: 'Places the bishop on an exposed diagonal where it can be attacked by a3+b4. After c3, the bishop must move again losing time.',
        punishment: 'c3! — After d4, the bishop on c5 is cut off and b4! drives it away with tempo. White continues with cxd4 exd4 Nbd2 with passive bishop.',
        punishmentMoves: ['c3'],
      },
      {
        moves: ['Nf3','d5','g3','Nf6','Bg2','c5','O-O','Nc6','d3','e5','e4','d4'],
        badMove: 'd4',
        level: 'intermediate',
        explanation: 'Closing the center without ...Be7 and O-O can lead to danger. After Ng5! targeting f7, Black must react precisely.',
        punishment: 'Ng5! Be6 Nxe6 fxe6 f4! — White opens the f-file against Black\'s king. After exf4 gxf4, White has a dangerous kingside attack.',
        punishmentMoves: ['Ng5'],
      },
      {
        moves: ['Nf3','d5','g3','Nf6','Bg2','c6','O-O','g6'],
        badMove: 'g6',
        level: 'beginner',
        explanation: 'Attempts a KID-style setup with colors reversed, but White simply plays d4 and c4, transposing to favorable structures. Black\'s fianchetto doesn\'t help since White already covers the long diagonal.',
        punishment: 'd4! Bg7 c4! — White immediately seizes the center. After O-O Nc3 dxc4 e4, White has a huge center and Black has no counterplay.',
        punishmentMoves: ['d4'],
      },
    ],
  },
  // Black standard
  {
    color: 'black',
    description: `**Why it's good:** The Najdorf is the most ambitious response to 1.e4 — it's been the weapon of choice for Fischer, Kasparov, and Carlsen. Black immediately creates queenside counterplay while keeping maximum flexibility. The a6 move prevents Bb5 and prepares ...b5, giving Black dynamic play on both sides.\n\n**Why it's tricky:** It's deeply theoretical and extremely sharp. One mistake in the mainlines (English Attack, Bg5 variation) can be fatal. You need extensive preparation and must be comfortable in complex tactical battles.\n\n**Long-term goals:** Launch queenside counterplay with ...b5-b4 to attack White's center. In many lines, Black's queenside play races against White's kingside attack — speed matters. The active piece play and pawn breaks (...d5, ...e5) give Black genuine winning chances.`,
    pgn: `[Event "Sicilian Najdorf"]
[Opening "Sicilian Najdorf"]
1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Be7 8. Qf3 Qc7 9. O-O-O Nbd7`,
    inaccuracies: [
      {
        moves: ['e4','c5','Nf3','d6','d4','cxd4','Nxd4','Nf6','Nc3','a6','Be2'],
        badMove: 'Be2',
        level: 'intermediate',
        explanation: 'Too passive — allows Ng4! attacking the undefended bishop immediately. White loses the bishop pair or allows Black to dominate.',
        punishment: 'Ng4! — After Bxg4 Bxg4 f3 Bd7, Black equalizes comfortably and White\'s kingside is slightly weakened. Continue e5, Be7, O-O with pressure on e4.',
        punishmentMoves: ['Ng4'],
      },
      {
        moves: ['e4','c5','Nf3','d6','d4','cxd4','Nxd4','Nf6','Nc3','a6','Be3','e5','Nb3','Be6','f3'],
        badMove: 'f3',
        level: 'advanced',
        explanation: 'Premature — weakens e3 and allows d5! as an immediate break. The knight on b3 is offside and White\'s kingside is compromised before castling.',
        punishment: 'd5! exd5 Nxd5 Bxd5 Qxd5 Bb6 — Black regains the piece and has a solid position with the bishop pair in an open position.',
        punishmentMoves: ['d5'],
      },
      {
        moves: ['e4','c5','Nf3','d6','d4','cxd4','Nxd4','Nf6','Nc3','a6','Bc4'],
        badMove: 'Bc4',
        level: 'intermediate',
        explanation: 'The old Fischer Attack — largely refuted. After e6!, the bishop on c4 is blocked and after Nbd7, Be7, O-O, Black completes development with nothing to fear.',
        punishment: 'e6! — After Bb3 b5!, Black immediately launches queenside counterplay. After Bg5 Be7 O-O Bb7 f4 Nbd7, Black has a solid position with full compensation.',
        punishmentMoves: ['e6'],
      },
    ],
  },
  {
    color: 'black',
    description: `**Why it's good:** The French Defense is solid and principled. Black immediately contests the center with ...e6 and ...d5 and gets a very stable position. The structure leads to rich strategic play with clear plans for both sides. It's famously reliable — once Black knows the pawn structures, the plans become second nature.\n\n**Why it's tricky:** The c8 bishop is often restricted behind the pawn chain and can be a long-term weakness. White gets good kingside space and attacking chances. Black's position can feel cramped if you don't know the freeing moves.\n\n**Long-term goals:** Free the game with ...c5 (attacking d4) or ...f6 (attacking e5). Once the light-squared bishop is activated, Black's position opens up. In the endgame, the solid pawn structure and active pieces compensate for the earlier passivity.`,
    pgn: `[Event "French Defense: Mainline"]
[Opening "French Defense"]
1. e4 e6 2. d4 d5 3. Nc3 Nf6 4. Bg5 Be7 5. e5 Nfd7 6. Bxe7 Qxe7 7. f4 O-O 8. Nf3 c5 9. dxc5`,
    inaccuracies: [
      {
        moves: ['e4','e6','d4','d5','e5','c5','c3','Nc6','Nf3'],
        badMove: 'Nf3',
        level: 'beginner',
        explanation: 'In the Advance Variation, Nf3 without a3 preparation allows Qb6 attacking both b2 and d4 simultaneously. White cannot defend both.',
        punishment: 'Qb6! — attacks b2 and d4. After Be3 cxd4 cxd4 Nxd4 Nxd4 Qxd4, Black has won a pawn and has a comfortable position.',
        punishmentMoves: ['Qb6'],
      },
      {
        moves: ['e4','e6','d4','d5','Nd2','c5','Ngf3','cxd4','Nxd4','Nf6','exd5'],
        badMove: 'exd5',
        level: 'intermediate',
        explanation: 'Releasing the tension allows Black to recapture with the knight, giving excellent piece activity. Black achieves the Tarrasch setup with ...Nc6, ...Bc5 with full equality.',
        punishment: 'Nxd5! — Black has centralized knights and free development. After Nxd5 Qxd5 Bc4 Qd6 O-O Nc6, Black has a perfectly comfortable position.',
        punishmentMoves: ['Nxd5'],
      },
      {
        moves: ['e4','e6','d4','d5','Nc3','Bb4','e5','c5','a3','Bxc3+','bxc3','Ne7','Ng5'],
        badMove: 'Ng5',
        level: 'intermediate',
        explanation: 'Aggressive but premature. After O-O!, Black ignores the threat against f7 since after Nxf7 Rxf7 Bxf7+ Kxf7, White won an exchange but Black has two pieces for it.',
        punishment: 'O-O! — Black ignores the threat. After Qg4 cxd4 cxd4 Nc6!, Black develops with tempo threatening d4. White\'s attack is refuted.',
        punishmentMoves: ['O-O'],
      },
      {
        moves: ['e4','e6','d4','d5','Nc3','Nf6','e5','Nfd7','f4'],
        badMove: 'f4',
        level: 'advanced',
        explanation: 'Steinitz Variation — overextending with f4 before developing pieces. After c5 Nf3 Nc6, if White plays Be3 cxd4 Nxd4, Black has Bc5! hitting the weak f4-pawn and creating a backward e-pawn.',
        punishment: 'Bc5! — Black hits f4 and the e-pawn. After Qd2 O-O O-O-O Nxd4 Bxd4 b5!, Black launches queenside attack against White\'s king with the bishop pair.',
        punishmentMoves: ['Bc5'],
      },
    ],
  },
  {
    color: 'black',
    description: `**Why it's good:** The Caro-Kann is one of the soundest responses to 1.e4. Black develops the c8 bishop outside the pawn chain (unlike the French) and achieves a very solid structure. Tal famously hated playing against it — it's just too solid. Great for players who prefer structural soundness over early tactics.\n\n**Why it's tricky:** Black can be slightly passive in the early middlegame, and White keeps more space. You need to be patient and know the right moment to activate.\n\n**Long-term goals:** After the early piece exchanges, Black gets a healthy pawn structure and active pieces. The key plan is activating the bishop pair and playing ...c5 or ...e5 at the right moment. Black's endgames are typically very comfortable due to the healthy pawn structure.`,
    pgn: `[Event "Caro-Kann: Mainline"]
[Opening "Caro-Kann"]
1. e4 c6 2. d4 d5 3. Nc3 dxe4 4. Nxe4 Bf5 5. Ng3 Bg6 6. h4 h6 7. Nf3 Nd7 8. h5 Bh7 9. Bd3 Bxd3 10. Qxd3 e6 11. Bf4`,
    inaccuracies: [
      {
        moves: ['e4','c6','d4','d5','e5','Bf5','Nf3'],
        badMove: 'Nf3',
        level: 'beginner',
        explanation: 'In the Advance Caro-Kann, Nf3 without h4 or Nc3 allows Black to establish the bishop comfortably on f5. White\'s e5 pawn can become a target.',
        punishment: 'c5! — Black immediately challenges the d4-e5 pawn chain. After dxc5 Nbc6, Black has active pieces and will recover the c5-pawn with a comfortable game.',
        punishmentMoves: ['c5'],
      },
      {
        moves: ['e4','c6','d4','d5','Nc3','dxe4','Nxe4','Bf5','Ng3','Bg6','h4','h6','Nf3','Nd7','h5','Bh7','Bd3'],
        badMove: 'Bd3',
        level: 'intermediate',
        explanation: 'The main move but leads to 9...Bxd3 10.Qxd3, the standard position. If White recaptures with cxd3?! instead of Qxd3, Black gets easy counterplay against the doubled pawns.',
        punishment: 'Bxd3 — After Qxd3 e6 Bf4 Ngf6 O-O-O Be7, Black has a solid position and can launch a kingside attack with c5 and Qa5.',
        punishmentMoves: ['Bxd3'],
      },
      {
        moves: ['e4','c6','d4','d5','exd5','cxd5','c4'],
        badMove: 'c4',
        level: 'advanced',
        explanation: 'The Panov-Botvinnik is perfectly sound but if White plays Nf3 without ensuring c4-pawn is defended after Bb4, Black creates immediate pressure on the c3-knight.',
        punishment: 'Nf6 Nc3 e6 Nf3 Bb4! — Black pins the knight and creates immediate pressure. After cxd5 Nxd5 Bd2 Nc6, Black develops actively and the isolated d4-pawn becomes a target.',
        punishmentMoves: ['Nf6'],
      },
    ],
  },
  {
    color: 'black',
    description: `**Why it's good:** The QGD Orthodox is one of the most classical and reliable defenses in chess. Black accepts a slightly passive position in exchange for rock-solid structure. The resulting positions are deeply strategic — Black's pieces find good squares and the position is very hard to crack.\n\n**Why it's tricky:** White keeps a persistent space advantage and Black must be precise to avoid being slowly squeezed. The c8 bishop can be problematic before ...dxc4 or ...c5 frees the game.\n\n**Long-term goals:** Break free with ...dxc4 and ...c5 or ...e5 to activate the pieces. Once the bishops are activated, Black's position is fully equal. Look for the ...Nd5 manoeuvre to centralise pieces and create counterplay against White's center.`,
    pgn: `[Event "QGD Orthodox"]
[Opening "QGD Orthodox"]
1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O 6. Nf3 Nbd7 7. Rc1 c6 8. Bd3 dxc4 9. Bxc4 Nd5`,
    inaccuracies: [
      {
        moves: ['d4','d5','c4','e6','Nc3','Nf6','Bg5','Be7','e3','O-O','Nf3','h6','Bh4','b6','cxd5'],
        badMove: 'cxd5',
        level: 'intermediate',
        explanation: 'Releases the central tension prematurely. After exd5, Black gets a symmetric pawn structure and easy piece development. White has given up the hanging pawns advantage.',
        punishment: 'exd5! — After Bd3 Bb7 O-O c5!, Black challenges the center. After dxc5 bxc5 Bxf6 Bxf6, Black has the bishop pair and an excellent game.',
        punishmentMoves: ['exd5'],
      },
    ],
  },
  // Black gambits
  {
    color: 'black',
    description: `**Why it's good:** The Benko Gambit is a long-term strategic investment. By sacrificing a pawn early, Black obtains permanent queenside pressure with open a and b files. White is often tied to defending the extra pawn while Black's rooks dominate the queenside. It's extremely unpleasant to face if you're not prepared.\n\n**Why it's tricky:** Black is objectively down a pawn and the compensation is positional rather than immediate. Patience is required — the pressure builds over many moves. If White defends accurately and consolidates, Black may not have enough.\n\n**Long-term goals:** Seize the open a and b files with Ra8 and Rb8, creating permanent queenside threats. Use the fianchettoed bishop on g7 to dominate the long diagonal. In the endgame, the queenside pawn majority and active pieces often outweigh White's extra pawn.`,
    pgn: `[Event "Benko Gambit"]
[Opening "Benko Gambit"]
1. d4 Nf6 2. c4 c5 3. d5 b5 4. cxb5 a6 5. bxa6 Bxa6 6. Nc3 d6 7. e4 Bxf1 8. Kxf1 g6 9. Nf3 Bg7`,
    inaccuracies: [
      {
        moves: ['d4','Nf6','c4','c5','d5','b5','Nf3'],
        badMove: 'Nf3',
        level: 'beginner',
        explanation: 'Too passive. After b4, Black gains queenside space and the c3-square is unavailable for White\'s knight. Black gets excellent counterplay without proper sacrifice.',
        punishment: 'b4! — After Bd2 d6 e4 g6 Bd3 Bg7, Black achieves a favorable King\'s Indian-type position where the b4-pawn cramps White\'s queenside.',
        punishmentMoves: ['b4'],
      },
      {
        moves: ['d4','Nf6','c4','c5','d5','b5','cxb5','a6','e3'],
        badMove: 'e3',
        level: 'beginner',
        explanation: 'Passive instead of bxa6. After axb5 Bxb5 Qa5+, Black has active play and the a-file is open. White has no compensation for the initiative Black is seizing.',
        punishment: 'axb5! — After Bxb5 Qa5+ Nc3 Bb4, Black pins the knight and has excellent compensation. After Bd2 Bxc3 bxc3 Nxe4, Black has won a pawn.',
        punishmentMoves: ['axb5'],
      },
      {
        moves: ['d4','Nf6','c4','c5','d5','b5','cxb5','a6','bxa6','Bxa6','Nc3','g6','e4','Bxf1','Kxf1','d6','Nf3','Bg7','g3'],
        badMove: 'g3',
        level: 'intermediate',
        explanation: 'Inconsistent — White has already castled by hand on f1; the g3-pawn weakens f3 and the White king is even more exposed. Black gets strong pressure on the a1-h8 diagonal.',
        punishment: 'Nbd7! — After Kg2 O-O Re1 Qb6, Black targets b2 and d4 simultaneously. After h3 Ng4!, the attack on the weakened kingside begins.',
        punishmentMoves: ['Nbd7'],
      },
      {
        moves: ['d4','Nf6','c4','c5','d5','b5','cxb5','a6','bxa6','Bxa6','Nc3','d6','f4'],
        badMove: 'f4',
        level: 'intermediate',
        explanation: 'Overaggressive — weakens the e4 square. After Black develops normally with g6, Bg7, O-O, the f4-pawn is a weakness. Black\'s queenside pressure combined with e4 weakness gives full compensation.',
        punishment: 'g6! — After e4 Bg7 Nf3 O-O, Black has a comfortable game. If e5? Nfd7 e6 Nxe6 fxe6 fxe6 dxe6 Nf6, Black wins material.',
        punishmentMoves: ['g6'],
      },
    ],
  },
  {
    color: 'black',
    description: `**Why it's good:** The Budapest Gambit is a sharp and underrated weapon against 1.d4. After 2...e5, Black immediately counterattacks and forces White out of their comfort zone. If White plays greedily, Black gets a powerful initiative with pieces swarming toward White's king.\n\n**Why it's tricky:** With accurate play, White can simply return the pawn with a comfortable position. It's more of a surprise weapon than an objectively equal system. At higher levels, experienced players know the refutations.\n\n**Long-term goals:** After winning back the gambit pawn, Black aims for active piece play with the bishops and knights aiming at White's kingside. The key themes are ...Ng4 threats, bishop activity, and keeping the initiative. Don't give White time to consolidate.`,
    pgn: `[Event "Budapest Gambit"]
[Opening "Budapest Gambit"]
1. d4 Nf6 2. c4 e5 3. dxe5 Ng4 4. Nf3 Bc5 5. e3 Nc6 6. Be2 Ngxe5 7. Nxe5 Nxe5 8. O-O d6`,
    inaccuracies: [
      {
        moves: ['d4','Nf6','c4','e5','dxe5','Ng4','e4'],
        badMove: 'e4',
        level: 'beginner',
        explanation: 'Too greedy. After Nxe5, White has overextended the pawn center and the e4-pawn is now a weakness. Black\'s knight on e5 is dominant and White falls behind in development.',
        punishment: 'Nxe5! — After f4 Neg4!, the knight retreats with tempo threatening h2. After h3 Nxe4! fxe4?? Qh4+, Black wins material.',
        punishmentMoves: ['Nxe5'],
      },
      {
        moves: ['d4','Nf6','c4','e5','dxe5','Ng4','Bf4','Bb4+','Nd2'],
        badMove: 'Nd2',
        level: 'intermediate',
        explanation: 'Passive — the knight blocks the c1-bishop and the d-file. After Nc6 Ngf3 Qe7, Black threatens both Ngxe5 and Ncxe5, winning back the pawn.',
        punishment: 'Nc6! — After Ngf3 Qe7 e3 Ngxe5 Nxe5 Nxe5, Black regains the pawn with an excellent position and bishop pair.',
        punishmentMoves: ['Nc6'],
      },
      {
        moves: ['d4','Nf6','c4','e5','dxe5','Ng4','Bf4','Nc6','Nf3','Bb4+','Nbd2'],
        badMove: 'Nbd2',
        level: 'intermediate',
        explanation: 'Inferior to Nc3 — blocks the d2 square for retreats. After Qe7, Black threatens to win back the pawn and White is cramped.',
        punishment: 'Qe7! — After a3 Ngxe5 axb4 Nxf3+ Nxf3 Nxb4, Black wins material with two pieces for a pawn-and-bishop.',
        punishmentMoves: ['Qe7'],
      },
      {
        moves: ['d4','Nf6','c4','e5','dxe5','Ng4','Nf3'],
        badMove: 'Nf3',
        level: 'beginner',
        explanation: 'Allows Nc6 and now White cannot play Bf4 without allowing Bb4+ and Qe7 winning back the e5-pawn. White\'s pieces are not coordinated to hold the pawn.',
        punishment: 'Nc6! — After Bf4 Bb4+ Nbd2 Qe7 e3 Ngxe5 Nxe5 Nxe5 Be2 d6, Black has regained the pawn and has a comfortable game.',
        punishmentMoves: ['Nc6'],
      },
    ],
  },
  // Black tricks
  {
    color: 'black',
    description: `**Why it's good:** The Stafford Gambit is a deadly practical weapon at club level. Black sacrifices a pawn for blistering development and aims straight for the throat. If White plays naturally, they walk into checkmate traps that are almost impossible to see over the board for the first time. It's a psychological weapon as much as a chess one.\n\n**Why it's tricky:** Objectively, the Stafford is refuted — White can get a large advantage with the right moves. If your opponent knows the correct response (d4, giving back material), you get nothing. It relies heavily on opponent ignorance.\n\n**Long-term goals:** The entire goal is speed — get the bishops and queen active before White knows what's happening. Target f2 and g2 with Bc5 and Qe7 threatening Qxe4+. The main trap ends in checkmate or winning White's queen. If White avoids the traps, try to maintain piece activity and look for tactical shots.`,
    pgn: `[Event "Stafford Gambit"]
[Opening "Stafford Gambit"]
1. e4 e5 2. Nf3 Nf6 3. Nxe5 Nc6 4. Nxc6 dxc6 5. d3 Bc5 6. Be2 h5 7. O-O Ng4 8. h3 Bxf2+ 9. Rxf2 Nxf2 10. Kxf2 Qd4+`,
    inaccuracies: [
      {
        moves: ['e4','e5','Nf3','Nf6','Nxe5','Nc6','Nxc6','dxc6','Nc3','Bc5','Bc4'],
        badMove: 'Bc4',
        level: 'beginner',
        explanation: 'After Nc3, if White plays Bc4?, Black plays Ng4! threatening f2. The h2-pawn is also a target and White cannot defend both f2 and e3. This is the heart of the Stafford trap.',
        punishment: 'Ng4! — After O-O Qh4! h3 Nxf2!, Black sacrifices the knight. After Rxf2 Bxf2+ Kxf2 Qxh3, Black has a rook and pawn for two pieces with a powerful attack.',
        punishmentMoves: ['Ng4'],
      },
      {
        moves: ['e4','e5','Nf3','Nf6','Nxe5','Nc6','Nxc6','dxc6','d3','Bc5','Be2'],
        badMove: 'Be2',
        level: 'beginner',
        explanation: 'Passive — allows h5! immediately, preparing h4, Ng4, and a kingside attack. White\'s bishop on e2 does not challenge the active bishop on c5.',
        punishment: 'h5! — After h3 Ng4!, Black sacrifices the knight. After hxg4 hxg4 Rg1 Qh4, White cannot stop checkmate threats.',
        punishmentMoves: ['h5'],
      },
      {
        moves: ['e4','e5','Nf3','Nf6','Nxe5','Nc6','Nxc6','dxc6','d3','Bc5','Nc3','Ng4','Be3'],
        badMove: 'Be3',
        level: 'intermediate',
        explanation: 'A direct trap. After Bxe3 fxe3 Qh4+! g3 Qxe4+, Black wins a pawn and has a powerful queen in the center with a shattered White kingside.',
        punishment: 'Bxe3! — After fxe3 Qh4+ g3 Nxe3 Qd2 Nxf1, Black wins material. After Rxf1 O-O, Black has won the bishop and has the e4-pawn under attack.',
        punishmentMoves: ['Bxe3'],
      },
      {
        moves: ['e4','e5','Nf3','Nf6','Nxe5','Nc6','Nxc6','dxc6','d3','Bc5','Be2','Ng4','Bxg4'],
        badMove: 'Bxg4',
        level: 'intermediate',
        explanation: 'Bxg4?? allows Qh4!! which immediately threatens Qxf2# and attacks the Bg4. White cannot defend both.',
        punishment: 'Qh4! — After Qf3 Bxg4 Qxg4 Qxg4, Black is up a bishop. If g3 Qxg4 O-O Bxf2+ Rxf2 Qxd1, Black wins the queen.',
        punishmentMoves: ['Qh4'],
      },
    ],
  },
  {
    color: 'black',
    description: `**Why it's good:** The Englund Gambit Trap is one of the most lethal traps in chess — if White takes the bait, the game ends in checkmate in just 8 moves. It's a brilliant surprise weapon in quick games and is completely unexpected from the opening moves.\n\n**Why it's tricky:** It's one of the most dubious openings in chess. Any player who knows the refutation (simply declining or playing d5) gets a completely winning position. It has zero practical value against prepared opponents and almost no strategic depth — it's purely a trap.\n\n**Long-term goals:** The entire point is the one trap. After 1.d4 e5 2.dxe5 Nc6 3.Nf3 Qe7, White has already fallen slightly behind. If they grab with 4.Bf4??, Black wins the queen with Qb4+. Use it in blitz or against unsuspecting opponents, but don't rely on it as a serious opening.`,
    pgn: `[Event "Englund Gambit Trap"]
[Opening "Englund Gambit Trap"]
1. d4 e5 2. dxe5 Nc6 3. Nf3 Qe7 4. Bf4 Qb4+ 5. Bd2 Qxb2 6. Bc3 Bb4 7. Qd2 Bxc3 8. Qxc3 Qc1#`,
    inaccuracies: [
      {
        moves: ['d4','e5','dxe5','Nc6','Nf3','Qe7','Nc3'],
        badMove: 'Nc3',
        level: 'beginner',
        explanation: 'The most common beginner mistake. After Qb4!, White cannot conveniently defend both b2 and the c3-knight. After Bd2 Qxb2 Nd5?! Qxa1 Nxc7+ Kd8 Nxa8 b5!, the knight on a8 is trapped.',
        punishment: 'Qb4! — After Bd2 Qxb2 Rb1? Qa3!, the queen escapes and White\'s queenside is wrecked. After Nd5 Bb4 Bxb4 Nxb4 Nc3 Nxc2+!, Black wins a piece.',
        punishmentMoves: ['Qb4'],
      },
      {
        moves: ['d4','e5','dxe5','Nc6','Nf3','Qe7','Bf4','Qb4+','Bd2'],
        badMove: 'Bd2',
        level: 'beginner',
        explanation: 'Blocks the d2-square for the knight. After Qxb2 Bc3 Bb4!, White\'s pieces trip over each other. The bishop on c3 pins itself against the king after Bxc3+ and White\'s queenside is a mess.',
        punishment: 'Qxb2! — After Bc3 Bb4! Qd2 Bxc3 Qxc3 Qxc3+ Nxc3 Nxe5, Black has won two pawns with no compensation for White.',
        punishmentMoves: ['Qxb2'],
      },
      {
        moves: ['d4','e5','dxe5','Nc6','Nf3','Qe7','Bf4','Qb4+','Nc3'],
        badMove: 'Nc3',
        level: 'beginner',
        explanation: 'Loses material immediately. After Qxb2 Nd5 Qxa1!, the rook is trapped. After Nxc7+ Kd8 Nxa8 b5!, the knight is trapped and Black comes out material ahead.',
        punishment: 'Qxb2! — After Nd5 Qxa1! Nxc7+ Kd8 Nxa8 b5!, the knight on a8 has no escape. Black wins decisively.',
        punishmentMoves: ['Qxb2'],
      },
      {
        moves: ['d4','e5','dxe5','Nc6','Nf3','Qe7','Bf4','Qb4+','c3'],
        badMove: 'c3',
        level: 'intermediate',
        explanation: 'Allows Qxb2 Nbd2 Qxa1 — Black has won the rook. White hoped to trap the queen with Nb1, but after d6! exd6 Bg4!, the queen escapes via b2.',
        punishment: 'Qxb2! — After Nbd2 Qxa1 Nb1 d6! exd6 Bg4!, the queen escapes. After dxc7 Bxf3 Qxf3 Qxb1+, Black wins more material.',
        punishmentMoves: ['Qxb2'],
      },
    ],
  },
  {
    color: 'black',
    description: `**Why it's good:** The Elephant Gambit is a surprise weapon where Black immediately counters 1.e4 e5 2.Nf3 with 2...d5, sacrificing a pawn for rapid counterplay. If White isn't prepared, the position quickly becomes complicated and Black can seize the initiative. It's completely unexpected and difficult to handle over the board.\n\n**Why it's tricky:** Objectively, the Elephant Gambit is unsound — White gets a clear advantage with correct play (3.exd5 e4 4.Qe2!). Black's compensation is more tactical than structural and relies on White making natural-looking but inaccurate moves.\n\n**Long-term goals:** After the pawn sacrifice, aim for rapid piece activity — especially the dark-squared bishop and the queen. The Ng4 manoeuvre hitting f2 is a key motif. Keep the initiative and don't allow White to consolidate. The gambit works best when White plays too cautiously and allows Black to recover the pawn with a good position.`,
    pgn: `[Event "Elephant Gambit"]
[Opening "Elephant Gambit"]
1. e4 e5 2. Nf3 d5 3. exd5 e4 4. Qe2 Nf6 5. d3 Qxd5 6. Nd4 Bc5 7. Nb3 Bb6 8. dxe4 Nxe4`,
    inaccuracies: [
      {
        moves: ['e4','e5','Nf3','d5','exd5','e4','Qe2'],
        badMove: 'Qe2',
        level: 'beginner',
        explanation: 'After Qe7!, White\'s queen is blocked. Black recaptures the pawn via Nf6 and fights for the initiative. The queen trade leads to an even endgame with Black\'s bishop pair as compensation.',
        punishment: 'Qe7! — After Nd4 Nf6 Nc3 Nxd5, Black recovers the pawn with a solid position and the bishop pair.',
        punishmentMoves: ['Qe7'],
      },
      {
        moves: ['e4','e5','Nf3','d5','exd5','e4','Ne5'],
        badMove: 'Ne5',
        level: 'beginner',
        explanation: 'Most common beginner response — a serious mistake. After Bd6!, the knight is challenged and after d4 exd3 Nxd3, Black has excellent development with the d5-pawn falling.',
        punishment: 'Bd6! — After d4 exd3 Nxd3 Nf6! Bg5? Nxd5!, Black wins the d5-pawn. After Bxd8 Bxh2!! Be7 Bg3+ Ke2 Nxe7, Black wins the exchange.',
        punishmentMoves: ['Bd6'],
      },
      {
        moves: ['e4','e5','Nf3','d5','exd5','e4','Nc3'],
        badMove: 'Nc3',
        level: 'intermediate',
        explanation: 'Reasonable but misses the critical lines. After Bc5! Nb3 Bb6 d4 exd3 cxd3 O-O, Black castles quickly with a lead in development and active bishops targeting the d3-pawn.',
        punishment: 'Bc5! — After Nb3 Bb6 d4 exd3 cxd3 O-O Re1 Re8, Black has a lead in development and the active bishop pair compensates for the pawn.',
        punishmentMoves: ['Bc5'],
      },
      {
        moves: ['e4','e5','Nf3','d5','Nxe5'],
        badMove: 'Nxe5',
        level: 'beginner',
        explanation: 'Instead of the mainline exd5, this leads to trouble. After dxe4!, Black attacks the knight and after Bc4 Qg5!, Black threatens both the knight and the bishop simultaneously.',
        punishment: 'dxe4! — After Bc4 Qg5!, White must retreat or sacrifice. After d4 Qxg2 Rf1 Bg4!, Black has a dominant position with the material advantage.',
        punishmentMoves: ['dxe4'],
      },
    ],
  },
]

let cached: Opening[] | null = null

export function getPreloadedOpenings(): Opening[] {
  if (cached) return cached
  cached = raw.flatMap(({ pgn, color, description, inaccuracies }) => {
    const openings = parsePgn(pgn, { color })
    return openings.map((o) => ({ ...o, description, inaccuracies }))
  })
  return cached
}
