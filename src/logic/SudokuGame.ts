import { List, Set } from 'immutable';
import { BoardMatrix, Coords } from 'types';

const EMPTY_VALUE = 0;
const BOARD_SIZE = 9;

export enum DIFFICULTY {
  EASY,
  MEDIUM,
  HARD,
}

function shouldUnsolve(difficulty: DIFFICULTY): boolean {
  const coin = Math.random();

  switch (difficulty) {
    case DIFFICULTY.EASY:
      return coin > 0.5;
    case DIFFICULTY.MEDIUM:
      return coin > 0.4;
    case DIFFICULTY.HARD:
      return coin > 0.2;
  }
}

export function generateEmptyBoard(): BoardMatrix {
  let board: BoardMatrix = List();

  for (let i = 0; i < BOARD_SIZE; i++) {
    const row = List(Array<number>(BOARD_SIZE).fill(EMPTY_VALUE));
    board = board.set(i, row);
  }

  return board;
}

export function generateBoard(
  difficulty: DIFFICULTY = DIFFICULTY.MEDIUM
): BoardMatrix {
  const unsolve = (b: BoardMatrix): BoardMatrix => {
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        if (shouldUnsolve(difficulty)) {
          b = updateCell(b, x, y, EMPTY_VALUE);
        }
      }
    }

    return b;
  };

  return unsolve(solve(generateEmptyBoard())!);
}

export function getCellValue(
  board: BoardMatrix,
  col: number,
  row: number
): number {
  const cell = board.get(row)?.get(col);

  if (cell === undefined) {
    throw new Error(`No cell was found at: {x: ${col}, y: ${row}}`);
  }

  return cell;
}

export function updateCell(
  board: BoardMatrix,
  col: number,
  row: number,
  num: number
): BoardMatrix {
  return board.update(row, row => row.set(col, num));
}

export function isValid(
  board: BoardMatrix,
  col: number,
  row: number,
  num: number
): boolean {
  if (num < 1 || num > 9) {
    return false;
  }

  for (let i = 0; i < BOARD_SIZE; i++) {
    const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
    const n = 3 * Math.floor(col / 3) + (i % 3);
    if (
      (i !== col && getCellValue(board, i, row) === num) ||
      (i !== row && getCellValue(board, col, i) === num) ||
      (n !== col && m !== row && getCellValue(board, n, m) === num)
    ) {
      return false;
    }
  }

  return true;
}

export function isEmpty(board: BoardMatrix, col: number, row: number): boolean {
  return getCellValue(board, col, row) === EMPTY_VALUE;
}

export function isBoardSolved(board: BoardMatrix): boolean {
  const goodRow = Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  return board.every(row => row.toSet().equals(goodRow));
}

export function findCandidates(
  board: BoardMatrix,
  col: number,
  row: number
): Set<number> {
  let found = Set<number>();

  for (let i = 0; i < BOARD_SIZE; i++) {
    const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
    const n = 3 * Math.floor(col / 3) + (i % 3);

    found = found
      .add(getCellValue(board, i, row))
      .add(getCellValue(board, col, i))
      .add(getCellValue(board, n, m));
  }

  return Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9])
    .subtract(found)
    .sort(() => Math.random() - 0.5)
    .toSet();
}

export function solve(board: BoardMatrix): BoardMatrix | undefined {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = getCellValue(board, col, row);
      if (cell === EMPTY_VALUE || !isValid(board, col, row, cell)) {
        const candidates = findCandidates(board, col, row);
        for (const cand of candidates) {
          const solvedBoard = solve(updateCell(board, col, row, cand));
          if (solvedBoard !== undefined) {
            return solvedBoard;
          }
        }
        return undefined;
      }
    }
  }

  return board;
}

export function findErrors(board: BoardMatrix): Set<Coords> {
  let errs = Set<Coords>();
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (!isValid(board, col, row, getCellValue(board, col, row))) {
        errs = errs.add({ row, col });
      }
    }
  }

  return errs;
}

export function cleanErrors(
  board: BoardMatrix,
  errs: Set<Coords>
): BoardMatrix {
  return errs.reduce<BoardMatrix>(
    (b, coords) => updateCell(b, coords.col, coords.row, EMPTY_VALUE),
    board
  );
}

export function solveErrors(
  board: BoardMatrix,
  errs: Set<Coords>
): BoardMatrix {
  return errs.reduce<BoardMatrix>((b, coords) => {
    const candidates = findCandidates(b, coords.col, coords.row);
    return candidates.size
      ? updateCell(b, coords.col, coords.row, candidates.first())
      : b;
  }, board);
}

export function eachCell(
  fn: (r: number, c: number) => boolean | undefined
): void {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (fn(row, col) === false) {
        break;
      }
    }
  }
}
