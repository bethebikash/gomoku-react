import { NavLink, useNavigate } from 'react-router-dom'
import './style.css'

const NavBar = () => {
  const navigate = useNavigate();
  const isAuth = localStorage.getItem('isAuth');

  const handleLogout = () => {
    localStorage.removeItem('isAuth');
    navigate('/login');
  }

  return (
    <nav>
      <ul>
        <li>
          <NavLink to='/' className='brand'>Gomoku</NavLink>
        </li>
      </ul>
      <ul>
        {!isAuth &&
          <li>
            <NavLink to='/login'>Login</NavLink>
          </li>
        }
        {isAuth &&
          <li>
            <NavLink to='/game-history'>Previous Game</NavLink>
          </li>
        }
        {isAuth &&
          <li>
            <button className='btn' onClick={handleLogout}>Logout</button>
          </li>
        }
      </ul>
    </nav>
  )
}

export default NavBar