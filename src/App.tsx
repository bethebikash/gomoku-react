import { Route, Routes } from "react-router-dom";
import './App.css';
import NavBar from './components/Navbar';
import Game from './pages/Game';
import GameHistory from "./pages/GameHistory";
import GameLog from "./pages/GameLog";
import Home from './pages/Home';
import Login from "./pages/Login";

function App() {

  return (
    <div className="app">
      <header className="app-header">
        <NavBar />
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/game" element={<Game />} />
          <Route path="/game-history" element={<GameHistory />} />
          <Route path="/game-log/:id" element={<GameLog />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
