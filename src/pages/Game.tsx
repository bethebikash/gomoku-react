import React, { useState, useRef, useEffect } from 'react';

enum StoneColor {
  None,
  Black,
  White,
}

const GomokuGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [board, setBoard] = useState<StoneColor[][]>(Array.from({ length: 15 }, () => Array(15).fill(StoneColor.None)));
  const [currentPlayer, setCurrentPlayer] = useState<StoneColor>(StoneColor.Black);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const tileSizeRef = useRef<number>(0);

  const drawBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    tileSizeRef.current = canvas.width / 15;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 15; col++) {
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
  };

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

      drawBoard();

      if (checkWin(row, col)) {
        setGameOver(true);
        const winner = currentPlayer;
        updateWinStatus(winner);
        return;
      }

      if (isDraw()) {
        setGameOver(true);
        updateDrawStatus();
        return;
      }

      setCurrentPlayer(prevPlayer => (prevPlayer === StoneColor.Black ? StoneColor.White : StoneColor.Black));
      updateTurnStatus();
    }
  };

  const checkWin = (row: number, col: number): boolean => {
    const directions = [
      [1, 0], // Horizontal
      [0, 1], // Vertical
      [1, 1], // Diagonal (top-left to bottom-right)
      [1, -1], // Diagonal (top-right to bottom-left)
    ];

    const currentPlayer = board[row][col];

    // Check in all directions for a line of five stones
    for (const [dx, dy] of directions) {
      let count = 1;

      // Check in the positive direction
      let x = row + dx;
      let y = col + dy;
      while (x >= 0 && x < 15 && y >= 0 && y < 15 && board[x][y] === currentPlayer) {
        count++;
        x += dx;
        y += dy;
      }

      // Check in the negative direction
      x = row - dx;
      y = col - dy;
      while (x >= 0 && x < 15 && y >= 0 && y < 15 && board[x][y] === currentPlayer) {
        count++;
        x -= dx;
        y -= dy;
      }

      // If a line of five stones is found, return true
      if (count >= 5) {
        return true;
      }
    }

    // No winning condition found
    return false;
  };

  const isDraw = (): boolean => {
    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 15; col++) {
        if (board[row][col] === StoneColor.None) {
          return false; // If there is an empty cell, the game is not a draw
        }
      }
    }
    return true; // If no empty cell is found, the game is a draw
  };

  useEffect(() => {
    drawBoard();
  }, []);

  const updateTurnStatus = () => {
    const turnStatusElement = document.getElementById('turnStatus');
    if (turnStatusElement) {
      turnStatusElement.textContent = currentPlayer === StoneColor.Black ? 'Black' : 'White';
    }
  };

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
    setBoard(Array.from({ length: 15 }, () => Array(15).fill(StoneColor.None)));
    setCurrentPlayer(StoneColor.Black);
    setGameOver(false);
    drawBoard();
    updateTurnStatus();
    updateClearStatus();
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

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={450}
        height={450}
        style={{ border: '1px solid #000' }}
        onClick={handleCanvasClick}
      />
      <div id="actions">
        <div id="activePlayer">
          <div>Turn: </div>
          <div id="turnStatus"></div>
        </div>
        <button id="resetButton" onClick={resetGame}>Reset Game</button>
      </div>
      <div id="winContainer">
        <div id="winStatus"></div>
        <div id="drawStatus"></div>
        <p>Reset the game to play again.</p>
      </div>
    </div>
  );
};

export default GomokuGame;

