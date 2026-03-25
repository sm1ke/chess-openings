import { parsePgn } from '../utils/parsePgn'
import type { Opening } from '../types'

const raw: { pgn: string; color: 'white' | 'black' }[] = [
  // White standard
  {
    color: 'white',
    pgn: `[Event "Italian Game: Giuoco Piano"]
[Opening "Italian Game: Giuoco Piano"]
1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4 exd4 6. cxd4 Bb4+ 7. Nc3 Nxe4 8. O-O Bxc3 9. d5 Bf6 10. Re1 Ne7 11. Rxe4 d6 12. Bg5`,
  },
  {
    color: 'white',
    pgn: `[Event "Ruy Lopez: Mainline"]
[Opening "Ruy Lopez"]
1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Na5 10. Bc2 c5 11. d4`,
  },
  {
    color: 'white',
    pgn: `[Event "Queen's Gambit: Mainline"]
[Opening "Queen's Gambit"]
1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O 6. Nf3 h6 7. Bh4 b6 8. cxd5 Nxd5 9. Bxe7 Qxe7`,
  },
  {
    color: 'white',
    pgn: `[Event "English Opening"]
[Opening "English Opening"]
1. c4 e5 2. Nc3 Nf6 3. Nf3 Nc6 4. g3 d5 5. cxd5 Nxd5 6. Bg2 Nb6 7. O-O Be7 8. d3`,
  },
  // White gambits
  {
    color: 'white',
    pgn: `[Event "King's Gambit"]
[Opening "King's Gambit"]
1. e4 e5 2. f4 exf4 3. Nf3 g5 4. h4 g4 5. Ne5 Nf6 6. Bc4 d5 7. exd5 Bd6 8. d4 Nh5`,
  },
  {
    color: 'white',
    pgn: `[Event "Evans Gambit"]
[Opening "Evans Gambit"]
1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Ba5 6. d4 exd4 7. O-O dxc3 8. Qb3 Qe7 9. Nxc3`,
  },
  {
    color: 'white',
    pgn: `[Event "Smith-Morra Gambit"]
[Opening "Smith-Morra Gambit"]
1. e4 c5 2. d4 cxd4 3. c3 dxc3 4. Nxc3 Nc6 5. Nf3 d6 6. Bc4 e6 7. O-O Nf6 8. Qe2 Be7 9. Rd1`,
  },
  // White systems
  {
    color: 'white',
    pgn: `[Event "London System"]
[Opening "London System"]
1. d4 d5 2. Bf4 Nf6 3. e3 e6 4. Nf3 c5 5. c3 Nc6 6. Nbd2 Bd6 7. Bg3 O-O 8. Bd3 b6 9. O-O Bb7`,
  },
  {
    color: 'white',
    pgn: `[Event "King's Indian Attack"]
[Opening "King's Indian Attack"]
1. Nf3 d5 2. g3 Nf6 3. Bg2 e6 4. O-O Be7 5. d3 O-O 6. Nbd2 c5 7. e4 Nc6 8. Re1 dxe4 9. dxe4`,
  },
  // Black standard
  {
    color: 'black',
    pgn: `[Event "Sicilian Najdorf"]
[Opening "Sicilian Najdorf"]
1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Be7 8. Qf3 Qc7 9. O-O-O Nbd7`,
  },
  {
    color: 'black',
    pgn: `[Event "French Defense: Mainline"]
[Opening "French Defense"]
1. e4 e6 2. d4 d5 3. Nc3 Nf6 4. Bg5 Be7 5. e5 Nfd7 6. Bxe7 Qxe7 7. f4 O-O 8. Nf3 c5 9. dxc5`,
  },
  {
    color: 'black',
    pgn: `[Event "Caro-Kann: Mainline"]
[Opening "Caro-Kann"]
1. e4 c6 2. d4 d5 3. Nc3 dxe4 4. Nxe4 Bf5 5. Ng3 Bg6 6. h4 h6 7. Nf3 Nd7 8. h5 Bh7 9. Bd3 Bxd3 10. Qxd3 e6 11. Bf4`,
  },
  {
    color: 'black',
    pgn: `[Event "QGD Orthodox"]
[Opening "QGD Orthodox"]
1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O 6. Nf3 Nbd7 7. Rc1 c6 8. Bd3 dxc4 9. Bxc4 Nd5`,
  },
  // Black gambits
  {
    color: 'black',
    pgn: `[Event "Benko Gambit"]
[Opening "Benko Gambit"]
1. d4 Nf6 2. c4 c5 3. d5 b5 4. cxb5 a6 5. bxa6 Bxa6 6. Nc3 d6 7. e4 Bxf1 8. Kxf1 g6 9. Nf3 Bg7`,
  },
  {
    color: 'black',
    pgn: `[Event "Budapest Gambit"]
[Opening "Budapest Gambit"]
1. d4 Nf6 2. c4 e5 3. dxe5 Ng4 4. Nf3 Bc5 5. e3 Nc6 6. Be2 Ngxe5 7. Nxe5 Nxe5 8. O-O d6`,
  },
  // Black tricks
  {
    color: 'black',
    pgn: `[Event "Stafford Gambit"]
[Opening "Stafford Gambit"]
1. e4 e5 2. Nf3 Nf6 3. Nxe5 Nc6 4. Nxc6 dxc6 5. d3 Bc5 6. Be2 h5 7. O-O Ng4 8. h3 Bxf2+ 9. Rxf2 Nxf2 10. Kxf2 Qd4+`,
  },
  {
    color: 'black',
    pgn: `[Event "Englund Gambit Trap"]
[Opening "Englund Gambit Trap"]
1. d4 e5 2. dxe5 Nc6 3. Nf3 Qe7 4. Bf4 Qb4+ 5. Bd2 Qxb2 6. Bc3 Bb4 7. Qd2 Bxc3 8. Qxc3 Qc1#`,
  },
  {
    color: 'black',
    pgn: `[Event "Elephant Gambit"]
[Opening "Elephant Gambit"]
1. e4 e5 2. Nf3 d5 3. exd5 e4 4. Qe2 Nf6 5. d3 Qxd5 6. Nd4 Bc5 7. Nb3 Bb6 8. dxe4 Nxe4`,
  },
]

let cached: Opening[] | null = null

export function getPreloadedOpenings(): Opening[] {
  if (cached) return cached
  cached = raw.flatMap(({ pgn, color }) =>
    parsePgn(pgn, { color })
  )
  return cached
}
