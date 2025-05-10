import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../assets/globalStyles/global.css';
import './Header.css';

function Header() {
  const location = useLocation();
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="app-header">
      <div className="container header-content">
        <a href="/" className="header-logo-container">
          <div className="header-logo">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <span className="header-logo-text">BookKeeper</span>
        </a>

        <div className="search-bar">
          <input type="text" placeholder="Search books, notes or users..." />
        </div>

        <div className="user-menu">
          <Link to="/about" className="header-link">About</Link>
          <Link to="/faq" className="header-link">FAQ/Help</Link>
          <a href="#" style={{ color: 'white' }}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </a>
          <div className="user-avatar">U</div>
        </div>
      </div>

      <nav className="app-nav">
        <div className="container">
          <ul className="nav-items">
            <li><Link to="/reading-list" className={isActive('/reading-list') ? 'active' : ''}>Reading List</Link></li>
            <li><Link to="/notes" className={isActive('/notes') ? 'active' : ''}>Notes</Link></li>
            <li><Link to="/share" className={isActive('/share') ? 'active' : ''}>Share</Link></li>
            <li><Link to="/book-search" className={isActive('/book-search') ? 'active' : ''}>Book Search</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;