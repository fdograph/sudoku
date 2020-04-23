import {
  generateEmptyBoard,
  BoardMatrix,
  getArea,
  isBoardSolved,
  isValid,
  findCandidates,
  solve,
  DIFFICULTY,
  generateBoard,
  getCol,
} from '../SudokuGame';
import { fromJS, Set, List } from 'immutable';

describe('Sudoku Game logic', () => {
  describe('generateEmptyBoard', () => {
    it('Should generate an empty board', () => {
      const emptyBoard = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];

      expect(generateEmptyBoard().toJS()).toEqual(emptyBoard);
    });
  });

  describe('getCol', () => {
    it('Should return the list of values in a column', () => {
      const board: BoardMatrix = fromJS([
        [0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 2, 0, 0, 0, 0, 0, 0],
        [0, 0, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 4, 0, 0, 0, 0, 0, 0],
        [0, 0, 5, 0, 0, 0, 0, 0, 0],
        [0, 0, 6, 0, 0, 0, 0, 0, 0],
        [0, 0, 7, 0, 0, 0, 0, 0, 0],
        [0, 0, 8, 0, 0, 0, 0, 0, 0],
        [0, 0, 9, 0, 0, 0, 0, 0, 0],
      ]);

      const expected = List<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]);

      expect(expected.equals(getCol(board, 2))).toEqual(true);
      expect(getCol(board, 2).includes(5)).toEqual(true);
    });
  });

  describe('getArea', () => {
    it('Should get the sudoku area of a value coordinates', () => {
      const board: BoardMatrix = fromJS([
        [1, 1, 1, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 3, 3, 3],
        [0, 0, 0, 0, 0, 0, 3, 3, 3],
        [0, 0, 0, 0, 0, 0, 3, 3, 3],
        [0, 0, 0, 4, 4, 4, 0, 0, 0],
        [0, 0, 0, 4, 4, 4, 0, 0, 0],
        [0, 0, 0, 4, 4, 4, 0, 0, 0],
      ]);

      const coords1 = [1, 2];
      const area1 = [1, 1, 1, 1, 1, 1, 1, 1, 1];

      expect(getArea(board, coords1[0], coords1[1]).toJS()).toEqual(area1);

      const coords2 = [6, 4];
      const area2 = [3, 3, 3, 3, 3, 3, 3, 3, 3];
      expect(getArea(board, coords2[0], coords2[1]).toJS()).toEqual(area2);

      const coords3 = [4, 7];
      const area3 = [4, 4, 4, 4, 4, 4, 4, 4, 4];
      expect(getArea(board, coords3[0], coords3[1]).toJS()).toEqual(area3);
    });

    it('Should throw when a malformed board is passed', () => {
      expect(() => {
        getArea(List(), 1, 1);
      }).toThrow();
    });
  });

  describe('isValid', () => {
    const solvedBoard: BoardMatrix = fromJS([
      [8, 2, 7, 1, 5, 4, 3, 9, 6],
      [9, 6, 5, 3, 2, 7, 1, 4, 8],
      [3, 4, 1, 6, 8, 9, 7, 5, 2],
      [5, 9, 3, 4, 6, 8, 2, 7, 1],
      [4, 7, 2, 5, 1, 3, 6, 8, 9],
      [6, 1, 8, 9, 7, 2, 4, 3, 5],
      [7, 8, 6, 2, 3, 5, 9, 1, 4],
      [1, 5, 4, 7, 9, 6, 8, 2, 3],
      [2, 3, 9, 8, 4, 1, 5, 6, 7],
    ]);

    it('Should fail if an input is out of range', () => {
      expect(isValid(solvedBoard, 2, 2, 110)).toEqual(false);
      expect(isValid(solvedBoard, 2, 2, 0)).toEqual(false);
      expect(isValid(solvedBoard, 2, 2, -4)).toEqual(false);
    });

    it('Should fail if an input is repeated in a row', () => {
      const board: BoardMatrix = fromJS([
        [1, 0, 3, 4, 5, 6, 7, 8, 9],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);
      expect(isValid(board, 1, 0, 3)).toEqual(false);
      expect(isValid(board, 1, 0, 2)).toEqual(true);
    });

    it('Should fail if an input is repeated in a row', () => {
      const board: BoardMatrix = fromJS([
        [0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 3],
        [0, 0, 0, 0, 0, 0, 0, 0, 4],
        [0, 0, 0, 0, 0, 0, 0, 0, 5],
        [0, 0, 0, 0, 0, 0, 0, 0, 6],
        [0, 0, 0, 0, 0, 0, 0, 0, 7],
        [0, 0, 0, 0, 0, 0, 0, 0, 8],
        [0, 0, 0, 0, 0, 0, 0, 0, 9],
      ]);
      expect(isValid(board, 8, 1, 3)).toEqual(false);
      expect(isValid(board, 8, 1, 2)).toEqual(true);
    });

    it('Should fail if an input is repeated in an area', () => {
      const board: BoardMatrix = fromJS([
        [1, 0, 3, 0, 0, 0, 0, 0, 0],
        [4, 5, 6, 0, 0, 0, 0, 0, 0],
        [7, 8, 9, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);
      expect(isValid(board, 1, 0, 9)).toEqual(false);
      expect(isValid(board, 1, 0, 2)).toEqual(true);
    });

    it('Should determine if a value is valid for a set of coordinates', () => {
      expect(isValid(solvedBoard, 2, 2, 1)).toEqual(true);
      expect(isValid(solvedBoard, 5, 6, 5)).toEqual(true);

      expect(isValid(solvedBoard, 7, 7, 1)).toEqual(false);
      expect(isValid(solvedBoard, 6, 6, 4)).toEqual(false);

      expect(isBoardSolved(solvedBoard)).toEqual(true);
    });
  });

  describe('isBoardSolved', () => {
    it('Should check if a board is solved corrctly or not', () => {
      const solvedBoard: BoardMatrix = fromJS([
        [8, 2, 7, 1, 5, 4, 3, 9, 6],
        [9, 6, 5, 3, 2, 7, 1, 4, 8],
        [3, 4, 1, 6, 8, 9, 7, 5, 2],
        [5, 9, 3, 4, 6, 8, 2, 7, 1],
        [4, 7, 2, 5, 1, 3, 6, 8, 9],
        [6, 1, 8, 9, 7, 2, 4, 3, 5],
        [7, 8, 6, 2, 3, 5, 9, 1, 4],
        [1, 5, 4, 7, 9, 6, 8, 2, 3],
        [2, 3, 9, 8, 4, 1, 5, 6, 7],
      ]);

      expect(isBoardSolved(solvedBoard)).toEqual(true);

      const wrongBoard: BoardMatrix = fromJS([
        [8, 2, 1, 1, 5, 4, 3, 9, 6],
        [9, 6, 5, 3, 2, 7, 1, 4, 8],
        [3, 4, 1, 6, 8, 9, 7, 5, 2],
        [5, 9, 3, 4, 6, 8, 2, 7, 1],
        [4, 7, 2, 5, 1, 3, 6, 8, 9],
        [6, 1, 8, 9, 7, 2, 4, 3, 5],
        [7, 8, 6, 2, 3, 5, 9, 1, 4],
        [1, 5, 4, 7, 9, 6, 8, 8, 3],
        [2, 3, 9, 8, 4, 1, 5, 6, 7],
      ]);

      expect(isBoardSolved(wrongBoard)).toEqual(false);
    });
  });

  describe('findCandidates', () => {
    it('Should return a set of possible fits for given coordinates', () => {
      const board: BoardMatrix = fromJS([
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 8, 9, 0, 0, 0, 0, 0, 0],
        [5, 6, 7, 0, 0, 0, 0, 0, 0],
        [6, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0, 0, 0, 0, 0],
        [7, 0, 0, 0, 0, 0, 0, 0, 0],
        [8, 0, 0, 0, 0, 0, 0, 0, 0],
        [9, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);
      const result = findCandidates(board, 8, 8);
      const expected = Set<number>([1, 2, 3, 4, 5, 6, 7, 8]);

      expect(result.equals(expected)).toEqual(true);
      expect(findCandidates(board, 2, 2).toJS()).toEqual([]);
    });
  });

  describe('solve', () => {
    it('Should solve and return a solved board', () => {
      const solvedBoard = [
        [8, 2, 7, 1, 5, 4, 3, 9, 6],
        [9, 6, 5, 3, 2, 7, 1, 4, 8],
        [3, 4, 1, 6, 8, 9, 7, 5, 2],
        [5, 9, 3, 4, 6, 8, 2, 7, 1],
        [4, 7, 2, 5, 1, 3, 6, 8, 9],
        [6, 1, 8, 9, 7, 2, 4, 3, 5],
        [7, 8, 6, 2, 3, 5, 9, 1, 4],
        [1, 5, 4, 7, 9, 6, 8, 2, 3],
        [2, 3, 9, 8, 4, 1, 5, 6, 7],
      ];

      const almostSolvedBoard: BoardMatrix = fromJS([
        [8, 2, 7, 1, 5, 4, 3, 9, 0],
        [9, 6, 5, 3, 2, 7, 1, 4, 0],
        [3, 4, 1, 6, 8, 9, 7, 5, 0],
        [5, 9, 3, 4, 6, 8, 2, 7, 0],
        [4, 7, 2, 5, 1, 3, 6, 8, 0],
        [6, 1, 8, 9, 7, 2, 4, 3, 0],
        [7, 8, 6, 2, 3, 5, 9, 1, 0],
        [1, 5, 4, 7, 9, 6, 8, 2, 0],
        [2, 3, 9, 8, 4, 1, 5, 6, 0],
      ]);

      const result = solve(almostSolvedBoard);
      expect(result?.toJS()).toEqual(solvedBoard);

      const empty = generateEmptyBoard();
      const solution = solve(empty)!;
      expect(isBoardSolved(solution)).toEqual(true);
    });
  });

  describe('generateBoard', () => {
    it('Should generate an EASY board', () => {
      const generatedBoard = generateBoard(DIFFICULTY.EASY);
      const flatBoard = generatedBoard.toJS().flat(Infinity);
      const emptyCellCount = flatBoard.filter(cell => cell === 0).length;
      const ratio = (emptyCellCount * 100) / 81;

      expect(ratio).toBeLessThanOrEqual(20);
    });

    it('Should generate a MEDIUM board by default', () => {
      const generatedBoard = generateBoard();
      const flatBoard = generatedBoard.toJS().flat(Infinity);
      const emptyCellCount = flatBoard.filter(cell => cell === 0).length;
      const ratio = (emptyCellCount * 100) / 81;

      expect(ratio).toBeLessThanOrEqual(60);
    });

    it('Should generate a HARD board', () => {
      const generatedBoard = generateBoard(DIFFICULTY.HARD);
      const flatBoard = generatedBoard.toJS().flat(Infinity);
      const emptyCellCount = flatBoard.filter(cell => cell === 0).length;
      const ratio = (emptyCellCount * 100) / 81;

      expect(ratio).toBeLessThanOrEqual(80);
    });

    it('Should generate a SOLVEABLE board', () => {
      const easyBoard = generateBoard(DIFFICULTY.EASY);
      const easySolved = solve(easyBoard);
      expect(easySolved).toBeTruthy();
      expect(isBoardSolved(easySolved!)).toEqual(true);

      const mediumBoard = generateBoard(DIFFICULTY.MEDIUM);
      const mediumSolved = solve(mediumBoard);
      expect(mediumSolved).toBeTruthy();
      expect(isBoardSolved(mediumSolved!)).toEqual(true);

      const hardBoard = generateBoard(DIFFICULTY.HARD);
      const hardSolved = solve(hardBoard);
      expect(hardSolved).toBeTruthy();
      expect(isBoardSolved(hardSolved!)).toEqual(true);
    });
  });
});
