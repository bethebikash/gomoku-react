import { useNavigate } from 'react-router-dom';
import { IGameDetails } from '../Game';
import './style.css'

const GameHistory = () => {
  const navigate = useNavigate();

  const gameDetails: IGameDetails[] = JSON.parse(localStorage.getItem('games') || '[]');

  const viewGameHistory = (id: number) => {
    navigate(`/game-log/${id}`);
  }

  return (
    <div className='history-container'>
      {gameDetails.map((game, index) => (
        <div className='game-info-wrapper' key={game.gameNumber}>
          <h4 className='game-info'> {`GAME #${index + 1} @${game.date},  ${game.result === 'Draw' ? 'Game is a draw' : 'Winner: ' + game.result}`}</h4>
          <button className='btn' onClick={() => viewGameHistory(game.gameNumber)}>
            View Game Log
          </button>
        </div>
      ))}

    </div>
  )
}

export default GameHistory