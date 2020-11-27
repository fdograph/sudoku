import React, { useState } from 'react';
import styled from 'styled-components';

import './styles.css';
import Board from '../Board';
import { BoardMatrix, Coords } from '../types';
import { DIFFICULTY, generateBoard } from '../Logic/SudokuGame';

const StyledScene = styled.div`
  display: flex;
  padding: 1em;
  justify-content: center;
  align-items: center;
  background: #222;

  .sudoku--board {
    width: 90vmin;
    height: 90vmin;
  }
`;

const Main: React.FC = () => {
  const [board, setBoard] = useState<BoardMatrix>(
    generateBoard(DIFFICULTY.MEDIUM)
  );
  const [selectedCell, setSelectedCell] = useState<Coords>({
    col: 0,
    row: 0,
  });

  return (
    <React.Fragment>
      <StyledScene>
        <Board
          board={board}
          coords={selectedCell}
          hints={true}
          updateCoords={setSelectedCell}
          updateBoard={setBoard}
        />
      </StyledScene>
    </React.Fragment>
  );
};

export default Main;
