import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Unauthorized from '../../components/Unautorized';
import { IGameDetails, StoneColor } from '../Game';
import './style.css';

const GameLog = () => {
  const navigate = useNavigate();
  // const isAuth = localStorage.getItem('isAuth');
  const { id } = useParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tileSizeRef = useRef<number>(0);

  const gameDetails: IGameDetails[] = JSON.parse(localStorage.getItem('games') || '[]');
  const gameDetail = gameDetails.find((game) => game.gameNumber === Number(id));

  const drawGameDetails = useCallback((gameDetails: IGameDetails) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    tileSizeRef.current = canvas.width / gameDetails.size;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the lines and saved moves
    for (let row = 0; row < gameDetails.size; row++) {
      for (let col = 0; col < gameDetails.size; col++) {
        ctx.beginPath();
        ctx.rect(col * tileSizeRef.current, row * tileSizeRef.current, tileSizeRef.current, tileSizeRef.current);
        ctx.strokeStyle = '#000';
        ctx.stroke();

        const move = gameDetails.moves.find((m: any) => m.row === row && m.col === col);
        if (move) {
          ctx.beginPath();
          ctx.arc(
            col * tileSizeRef.current + tileSizeRef.current / 2,
            row * tileSizeRef.current + tileSizeRef.current / 2,
            tileSizeRef.current / 2.5,
            0,
            2 * Math.PI
          );
          ctx.fillStyle = move.player === StoneColor.Black ? '#000' : '#fff';
          ctx.fill();

          ctx.font = '14px Arial';
          ctx.fillStyle = move.player === StoneColor.Black ? '#fff' : '#000';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText((gameDetails.moves.indexOf(move) + 1).toString(), col * tileSizeRef.current + tileSizeRef.current / 2, row * tileSizeRef.current + tileSizeRef.current / 2);
        }
      }
    }
  }, []);

  const handleBack = () => {
    navigate('/game-history')
  }

  useEffect(() => {
    if (gameDetail) {
      drawGameDetails(gameDetail);
    }
  }, [drawGameDetails, gameDetail, gameDetails, id]);


  // if (!isAuth) {
  //   return (<Unauthorized />)
  // }

  if (!gameDetail) {
    return <div>
      <h4>Game details not found!</h4>
    </div>
  }

  return (
    <div className='log-contailer'>
      <div className='winningStatus'>
        {gameDetail.result === 'Draw' ? 'Game is a draw' : 'Winner: ' + gameDetail.result}
      </div>
      <canvas
        ref={canvasRef}
        width={450}
        height={450}
        style={{ border: '1px solid #000' }}
      />
      <button className='btn btn-lg mt-20' onClick={handleBack}>
        Back
      </button>
    </div>
  )
}

export default GameLog