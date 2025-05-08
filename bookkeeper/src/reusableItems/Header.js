import './Header.css';

function Header() {
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
          <div className="user-avatar">CC</div>
        </div>
      </div>

      <nav className="app-nav">
        <div className="container">
          <ul className="nav-items">
            <li><a href="/reading">Reading List</a></li>
            <li><a href="/notes">Notes</a></li>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/community">Community</a></li>
            <li><a href="/books">Books</a></li>
            <li><a href="/faq">FAQ/Help</a></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;