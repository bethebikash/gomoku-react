import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './style.css';

const NavBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isAuth = localStorage.getItem('isAuth');


  const handleLogout = () => {
    localStorage.removeItem('isAuth');
    navigate('/login');
  }

  console.log('Location', pathname)

  return (
    <nav>
      <ul>
        <li>
          <NavLink to='/' className='brand'>Gomoku</NavLink>
        </li>
      </ul>
      <ul>
        {!isAuth && !(pathname === '/login') &&
          <li>
            <NavLink to='/login'>Login</NavLink>
          </li>
        }
        {isAuth && (pathname === '/') &&
          <li>
            <NavLink to='/game-history'>Previous Games</NavLink>
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