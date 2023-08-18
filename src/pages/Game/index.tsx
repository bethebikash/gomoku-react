import React, { useState, useRef, useEffect, useCallback } from 'react';
import './style.css'
import { useNavigate } from 'react-router-dom';

export interface IGameDetails {
  size: number;
  gameNumber: number;
  date: string;
  result: string;
  moves: Move[];
}

interface Move {
  row: number;
  col: number;
  player: number;
}

export enum StoneColor {
  None,
  Black,
  White,
}

const Game: React.FC = () => {
  const navigate = useNavigate();

  const boardSize: number = Number(localStorage.getItem('boardSize')) || 15;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [board, setBoard] = useState<StoneColor[][]>(Array.from({ length: boardSize }, () => Array(boardSize).fill(StoneColor.None)));
  const [currentPlayer, setCurrentPlayer] = useState<StoneColor>(StoneColor.Black);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [moves, setMoves] = useState<{ row: number; col: number; player: StoneColor }[]>([]);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const tileSizeRef = useRef<number>(0);

  const drawBoard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    tileSizeRef.current = canvas.width / boardSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const stone = board[row][col];
        ctx.beginPath();
        ctx.rect(col * tileSizeRef.current, row * tileSizeRef.current, tileSizeRef.current, tileSizeRef.current);
        ctx.strokeStyle = '#000';
        ctx.stroke();
        if (stone !== StoneColor.None) {
          ctx.beginPath();
          ctx.arc(
            col * tileSizeRef.current + tileSizeRef.current / 2,
            row * tileSizeRef.current + tileSizeRef.current / 2,
            tileSizeRef.current / 2.5,
            0,
            2 * Math.PI
          );
          ctx.fillStyle = stone === StoneColor.Black ? '#000' : '#fff';
          ctx.fill();
        }
      }
    }
  }, [board, boardSize]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameOver) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const col = Math.floor((event.clientX - rect.left) / tileSizeRef.current);
    const row = Math.floor((event.clientY - rect.top) / tileSizeRef.current);


    if (board[row][col] === StoneColor.None) {
      const newBoard = [...board];
      newBoard[row][col] = currentPlayer;

      setBoard(newBoard);

      // Update the moves state with the new move
      setMoves(prevMoves => [...prevMoves, { row, col, player: currentPlayer }]);

      if (checkWin(row, col)) {
        setGameOver(true);
        setGameFinished(true); // Set gameFinished to true when the game is finished
        updateWinStatus(currentPlayer);
        return;
      }

      if (isDraw()) {
        setGameOver(true);
        setGameFinished(true); // Set gameFinished to true when the game is finished
        updateDrawStatus();
        return;
      }

      setCurrentPlayer(prevPlayer => (prevPlayer === StoneColor.Black ? StoneColor.White : StoneColor.Black));
      updateTurnStatus();
    }
  };

  const checkWin = (row: number, col: number): StoneColor | null => {
    const directions = [
      [1, 0], // Horizontal
      [0, 1], // Vertical
      [1, 1], // Diagonal (top-left to bottom-right)
      [1, -1], // Diagonal (top-right to bottom-left)
    ];

    for (const [dx, dy] of directions) {
      let count = 1;
      let x = row + dx;
      let y = col + dy;

      while (
        x >= 0 &&
        x < boardSize &&
        y >= 0 &&
        y < boardSize &&
        board[x][y] === board[row][col]
      ) {
        count++;
        x += dx;
        y += dy;
      }

      x = row - dx;
      y = col - dy;

      while (
        x >= 0 &&
        x < boardSize &&
        y >= 0 &&
        y < boardSize &&
        board[x][y] === board[row][col]
      ) {
        count++;
        x -= dx;
        y -= dy;
      }

      if (count >= 5) {
        return board[row][col]; // Return the winning player's color
      }
    }

    return null; // No winning condition found
  };

  const isDraw = (): boolean => {
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        if (board[row][col] === StoneColor.None) {
          return false; // If there is an empty cell, the game is not a draw
        }
      }
    }
    return true; // If no empty cell is found, the game is a draw
  };

  const updateTurnStatus = useCallback(() => {
    const turnStatusElement = document.getElementById('turnStatus');
    if (turnStatusElement) {
      turnStatusElement.textContent = currentPlayer === StoneColor.Black ? 'Black' : 'White';
    }
  }, [currentPlayer]);




  const updateWinStatus = (winner: StoneColor) => {
    const winStatusElement = document.getElementById('winStatus');
    if (winStatusElement) {
      winStatusElement.textContent = `${winner === StoneColor.Black ? 'Black' : 'White'} wins!`;
      const winContainer = document.getElementById('winContainer');
      if (winContainer) {
        winContainer.style.display = 'flex';
      }
    }
  };

  const updateDrawStatus = () => {
    const drawStatusElement = document.getElementById('drawStatus');
    if (drawStatusElement) {
      drawStatusElement.textContent = "It's a draw!";
      const winContainer = document.getElementById('winContainer');
      if (winContainer) {
        winContainer.style.display = 'flex';
      }
    }
  };

  const resetGame = () => {
    setBoard(Array.from({ length: boardSize }, () => Array(boardSize).fill(StoneColor.None)));
    setCurrentPlayer(StoneColor.Black);
    setGameOver(false);
    drawBoard();
    updateTurnStatus();
    updateClearStatus();
  };

  const saveGameDetails = (result: string, moves: { row: number; col: number; player: StoneColor }[]) => {
    const gameDetails: IGameDetails = {
      size: boardSize,
      gameNumber: new Date().getTime(), // You can use a timestamp as a unique game number
      date: new Date().toLocaleString(),
      result,
      moves,
    };

    // Get existing games from localStorage or initialize an empty array
    const existingGames: IGameDetails[] = JSON.parse(localStorage.getItem('games') || '[]');

    // Add the new game details to the existing list
    existingGames.push(gameDetails);

    // Save the updated list back to localStorage
    localStorage.setItem('games', JSON.stringify(existingGames));
  };

  const saveGame = () => {
    if (gameFinished) {
      const lastMove = moves[moves.length - 1]; // Get the last move
      const winResult = checkWin(lastMove.row, lastMove.col);
      if (winResult !== null) {
        saveGameDetails(`${winResult === StoneColor.Black ? 'Black' : 'White'}`, moves);
        navigate('/game-history');
      } else if (isDraw()) {
        saveGameDetails("Draw", moves);
        navigate('/game-history');
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  const leaveGame = () => {
    console.log("game finish", gameFinished); // Log the value of gameFinished
    saveGame();
  };

  const updateClearStatus = () => {
    const winContainer = document.getElementById('winContainer');
    if (winContainer) {
      winContainer.style.display = 'none';
    }
    const winStatusElement = document.getElementById('winStatus');
    const drawStatusElement = document.getElementById('drawStatus');
    if (winStatusElement) {
      winStatusElement.textContent = '';
    }
    if (drawStatusElement) {
      drawStatusElement.textContent = '';
    }
  };

  useEffect(() => {
    drawBoard();
    updateTurnStatus();
  }, [drawBoard, updateTurnStatus]);

  return (
    <div className="game-container">

      <div id="container">
        <div id="activePlayer">
          <div>Turn: </div>
          <div id="turnStatus"></div>
        </div>
        <canvas
          ref={canvasRef}
          width={450}
          height={450}
          style={{ border: '1px solid #000' }}
          onClick={handleCanvasClick}
        />
        <div id="actions">

          <button className='btn' onClick={resetGame}>Reset Game</button>
          <button className='btn' onClick={leaveGame}>Leave</button>
        </div>
        <div id="winContainer">
          <div id="winStatus"></div>
          <div id="drawStatus"></div>
          <p>Click on "Restart" to play again.</p>
          <p>Click on "Leave" to save game details.</p>
        </div>
      </div>
    </div>
  );
};

export default Game;

