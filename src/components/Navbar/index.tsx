import React from 'react'
import { NavLink } from 'react-router-dom'
import './style.css'

const NavBar = () => {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to='/'>Gomoku Game</NavLink>
        </li>
      </ul>
      <ul>
        <li>
          <NavLink to='/login'>Login</NavLink>
        </li>
        <li>
          <NavLink to='/game'>Previous Game</NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default NavBar