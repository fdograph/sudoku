import { List, Set } from 'immutable';

const EMPTY_VALUE = 0;
const BOARD_SIZE = 9;

export type BoardMatrix = List<List<number>>;

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

export function generateBoard(
  difficulty: DIFFICULTY = DIFFICULTY.MEDIUM,
  passes: number = 2
): BoardMatrix {
  const unsolve = (b: BoardMatrix): BoardMatrix => {
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        if (flipCoin(difficulty)) {
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

export function getCellValue(
  board: BoardMatrix,
  xIndex: number,
  yIndex: number
): number {
  const cell = board.get(yIndex)?.get(xIndex);

  if (cell === undefined) {
    throw new Error(`No cell was found at: {x: ${xIndex}, y:${yIndex}}`);
  }

  return cell;
}

export function updateCell(
  board: BoardMatrix,
  xIndex: number,
  yIndex: number,
  num: number
): BoardMatrix {
  return board.update(yIndex, row => row.set(xIndex, num));
}

export function getRow(board: BoardMatrix, rowIndex: number): List<number> {
  const row = board.get(rowIndex);

  if (row === undefined) {
    throw new Error(`There is no row at index: ${rowIndex}`);
  }

  return row;
}

export function getCol(board: BoardMatrix, colIndex: number): List<number> {
  return board.map((row, i) => {
    const colValue = row.get(colIndex);

    if (colValue === undefined) {
      throw new Error(`No value found at: {x: ${colIndex}, y: ${i}}`);
    }

    return colValue;
  });
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

  const cell = getCellValue(board, xIndex, yIndex);

  // row check
  const row = getRow(board, yIndex);
  if (
    (cell !== num && row.includes(num)) ||
    (cell === num && row.count(cell => cell === num) > 1)
  ) {
    return false;
  }

  // area check
  const area = getArea(board, xIndex, yIndex);
  if (
    (cell !== num && area.includes(num)) ||
    (cell === num && area.count(cell => cell === num) > 1)
  ) {
    return false;
  }

  // col check
  const col = getCol(board, xIndex);
  if (
    (cell !== num && col.includes(num)) ||
    (cell === num && col.count(cell => cell === num) > 1)
  ) {
    return false;
  }

  return true;
}

export function isBoardSolved(board: BoardMatrix): boolean {
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (!isValid(board, x, y, getCellValue(board, x, y))) {
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
    getRow(board, yIndex),
    getCol(board, xIndex),
    getArea(board, xIndex, yIndex)
  );

  return Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9])
    .subtract(found)
    .sort(() => Math.random() - 0.5)
    .toSet();
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
