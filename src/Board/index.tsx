import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { BoardMatrix, Coords } from 'types';
import { updateCell, findCandidates, isValid, isEmpty } from 'Logic/SudokuGame';

const StyledBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(9, 1fr);
  gap: 0.125em;
  justify-items: stretch;
  background: #111;
`;

const StyledCell = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  align-content: stretch;
  justify-content: stretch;
  text-align: center;
  background: #1d1d1d;

  &.is-invalid {
    background: rgb(255, 111, 111);
  }

  &.is-empty {
    background: rgb(34, 34, 34);
  }

  &.is-selected {
    background: #000;
    &.is-invalid {
      background: rgb(255, 111, 111);
    }
  }

  &:hover .sudoku--cell-hints {
    display: block;
  }
`;

const StyledHints = styled.div`
  position: absolute;
  min-width: 130%;
  width: max-content;
  text-align: center;
  z-index: 10;
  top: -3em;
  left: 50%;
  transform: translateX(-50%);
  background: #ccc;
  color: #222;
  padding: 0.5em;
  border-radius: 0.25em;
  display: none;

  span {
    display: block;
  }

  span:first-child {
    font-size: 0.75em;
  }

  span:empty::before {
    content: '-';
  }
`;

const StyledInput = styled.input`
  display: flex;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  background: transparent;
  text-align: center;
  color: #ddd;
  font-size: 1.5em;
  font-weight: bold;
`;

interface IBoardProps {
  board: BoardMatrix;
  coords: Coords;
  hints: boolean;
  updateCoords: (c: Coords) => void;
  updateBoard: (b: BoardMatrix) => void;
}

const isSelected = (col: number, row: number, coords: Coords): boolean => {
  return col === coords.col && row === coords.row;
};

const Hints: React.FC<{ candidates: number[] }> = ({ candidates }) => (
  <StyledHints className="sudoku--cell-hints">
    <span>Hints:</span>
    <span>{candidates.join(' - ')}</span>
  </StyledHints>
);

const Board: React.FC<IBoardProps> = ({
  board,
  coords,
  hints,
  updateCoords,
  updateBoard,
}) => {
  const onKeyUp = useCallback(
    (col: number, row: number) => (e: React.KeyboardEvent) => {
      updateBoard(
        updateCell(board, col, row, Number(e.key.replace(/\D/g, '')))
      );
    },
    [board, updateBoard]
  );

  const matrix = useMemo(() => {
    return board
      .map((row, y) =>
        row.map((cell, x) => (
          <StyledCell
            className={classnames('sudoku--cell', {
              'is-selected': isSelected(x, y, coords),
              'is-invalid':
                !isEmpty(board, x, y) && !isValid(board, x, y, cell),
              'is-empty': isEmpty(board, x, y),
            })}
            key={`block:${x}:${y}`}
          >
            {hints && isSelected(x, y, coords) ? (
              <Hints candidates={findCandidates(board, x, y).toArray()} />
            ) : null}
            <StyledInput
              className="sudoku--cell-input"
              key={`cell:${x}:${y}`}
              value={cell || '-'}
              onFocus={() =>
                !isSelected(x, y, coords) && updateCoords({ col: x, row: y })
              }
              onKeyUp={onKeyUp(x, y)}
            />
          </StyledCell>
        ))
      )
      .flatten(false)
      .toArray();
  }, [board, coords, hints, onKeyUp, updateCoords]);

  return <StyledBoard className="sudoku--board">{matrix}</StyledBoard>;
};

export default Board;
