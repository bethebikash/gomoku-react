import { useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const [boardSize, setBoardSize] = useState<number>(5)

  const handleStart = () => {
    localStorage.setItem('boardSize', boardSize.toString());
    navigate('/game');
  }

  return (
    <div className="home-wrapper">
      <div className='container'>
        <div className='container-select'>
          <label>Game Size</label>
          <select className='select' value={boardSize} onChange={(e) => setBoardSize(Number(e.target.value))}>
            <option value={5}>5 x 5</option>
            <option value={6}>6 x 6</option>
            <option value={7}>7 x 7</option>
            <option value={8}>8 x 8</option>
            <option value={9}>9 x 0</option>
            <option value={10}>10 x 10</option>
            <option value={11}>11 x 11</option>
          </select>
        </div>

        <button className='btn block h-32' onClick={handleStart}>
          Start
        </button>
      </div>
    </div>
  )
}

export default Home