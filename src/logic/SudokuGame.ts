import { List, Set } from 'immutable';

export type BoardMatrix = List<List<number>>;

const EMPTY_VALUE = 0;
const BOARD_SIZE = 9;

export enum DIFFICULTY {
  EASY,
  MEDIUM,
  HARD,
}

function flipCoin(difficulty: DIFFICULTY): boolean {
  const coin = Math.floor(Math.random() * 10);

  switch (difficulty) {
    case DIFFICULTY.EASY:
      return coin > 8;
    case DIFFICULTY.MEDIUM:
      return coin > 6;
    case DIFFICULTY.HARD:
      return coin > 4;
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

export function getArea(
  board: BoardMatrix,
  xIndex: number,
  yIndex: number
): List<number> {
  const rowIndex = Math.floor(yIndex / 3) * 3;
  const colIndex = Math.floor(xIndex / 3) * 3;

  let area = List<number>();

  // row iteration
  for (let i = rowIndex; i <= rowIndex + 2; i++) {
    for (let j = colIndex; j <= colIndex + 2; j++) {
      const content = board.get(i)?.get(j);

      if (content === undefined) {
        throw new Error('Encountered a malformed board');
      }

      area = area.push(content);
    }
  }

  return area;
}

export function isValid(
  board: BoardMatrix,
  xIndex: number,
  yIndex: number,
  num: number
): boolean {
  if (num < 1 || num > 9) {
    return false;
  }

  const cellValue = board.get(yIndex)!.get(xIndex)!;

  // row check
  if (cellValue !== num && board.get(yIndex)?.includes(num)) {
    return false;
  }

  // col check
  for (let i = 0; i < BOARD_SIZE; i++) {
    if (i === yIndex) {
      continue;
    }

    if (board.get(i)?.get(xIndex) === num) {
      return false;
    }
  }

  if (cellValue !== num && getArea(board, xIndex, yIndex).includes(num)) {
    return false;
  }

  return true;
}

export function isBoardSolved(board: BoardMatrix): boolean {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (!isValid(board, j, i, board.get(i)!.get(j)!)) {
        return false;
      }
    }
  }

  return true;
}

export function findCandidates(
  board: BoardMatrix,
  xIndex: number,
  yIndex: number
): Set<number> {
  const found = Set<number>().union(
    board.get(yIndex)!,
    board.map(row => row.get(xIndex)!),
    getArea(board, xIndex, yIndex)
  );

  return Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9])
    .subtract(found)
    .sort(() => Math.random() - 0.5)
    .toSet();
}

export function getCellValue(
  board: BoardMatrix,
  xIndex: number,
  yIndex: number
): number {
  return board.get(yIndex)?.get(xIndex) || 0;
}

export function updateCell(
  board: BoardMatrix,
  xIndex: number,
  yIndex: number,
  num: number
): BoardMatrix {
  return board.update(yIndex, row => row.set(xIndex, num));
}

export function solve(board: BoardMatrix): BoardMatrix | undefined {
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (getCellValue(board, x, y) === EMPTY_VALUE) {
        const candidates = findCandidates(board, x, y).toArray();
        for (const cand of candidates) {
          const newBoard = solve(updateCell(board, x, y, cand));
          if (newBoard !== undefined) {
            return newBoard;
          }
        }
        return undefined;
      }
    }
  }

  return board;
}

export function generateBoard(
  difficulty: DIFFICULTY = DIFFICULTY.MEDIUM,
  passes: number = 5
): BoardMatrix {
  const unsolve = (b: BoardMatrix): BoardMatrix => {
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        const flip = flipCoin(difficulty);
        if (flip) {
          b = updateCell(b, x, y, EMPTY_VALUE);
        }
      }
    }

    return b;
  };

  let board = generateEmptyBoard();
  while (passes--) {
    board = unsolve(solve(board)!);
  }

  return board;
}
