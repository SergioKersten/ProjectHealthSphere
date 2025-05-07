// components/Navigation.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  if (!user) return null;
  
  return (
    <nav className="main-navigation">
      <div className="logo">
        <Link to="/">
          <h1>KrankenhausApp</h1>
        </Link>
      </div>
      
      <ul className="nav-links">
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/patienten">Patienten</Link>
        </li>
        <li>
          <Link to="/betten">Bettenverwaltung</Link>
        </li>
        <li>
          <Link to="/termine">Termine</Link>
        </li>
      </ul>
      
      <div className="user-menu">
        <span className="user-name">
          {user.name} ({user.rolle})
        </span>
        <button onClick={handleLogout} className="logout-btn">
          Abmelden
        </button>
      </div>
    </nav>
  );
};

export default Navigation;



