import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => (
  <header className="header">
    <div className="logo">
      <Link to="/">CS2-Drop</Link>
    </div>
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/rules">Rules</Link>
      <Link to="/faq">FAQ</Link>
      <Link to="/contact">Contact</Link>
    </nav>
    <div className="auth-buttons">
      <button className="neon-btn">Login</button>
      <button className="neon-btn">Register</button>
    </div>
  </header>
);

export default Header;