import { useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const size = localStorage.getItem('boardSize') || 5;
  const isAuth = localStorage.getItem('isAuth');

  const [boardSize, setBoardSize] = useState<number>(Number(size));

  const handleStart = () => {
    localStorage.setItem('boardSize', boardSize.toString());
    if (isAuth) {
      navigate('/game');
    } else {
      navigate('/login')
    }
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
            <option value={9}>9 x 9</option>
            <option value={10}>10 x 10</option>
            <option value={11}>11 x 11</option>
            <option value={12}>12 x 12</option>
            <option value={13}>13 x 13</option>
            <option value={14}>14 x 14</option>
            <option value={15}>15 x 15</option>
            <option value={16}>16 x 16</option>
            <option value={17}>17 x 17</option>
            <option value={18}>18 x 18</option>
            <option value={19}>19 x 19</option>
            <option value={20}>20 x 20</option>
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