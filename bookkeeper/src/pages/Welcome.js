import '../assets/globalStyles/global.css';
import './Welcome.css';

function Welcome() {
  return (
    <div className="welcome-container">
      <header>
        <h1>Welcome to BookKeeper (Title of App)</h1>
      </header>

      <div className="main-content">
        <div className="decoration decoration-1"></div>
        <div className="decoration decoration-2"></div>
        <div className="decoration decoration-3"></div>

        <div className="logo">
          <span className="logo-text">BK</span>
        </div>

        <div className="welcome-text">
          <h2>Track your reading journey</h2>
          <p>
            Keep notes and build your personal library with BookKeeper.
            (Slogan here idk)
          </p>
        </div>

        <div className="auth-options">
          <a href="#" className="btn btn-secondary">
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
              <path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z"></path>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            Login with Google
          </a>
          <a href="#" className="btn btn-primary">Create Account</a>
          <a href="#" className="btn btn-secondary">Login with Email</a>
        </div>
      </div>

      <footer className="welcome-footer">
        <p>&copy; 2025 Bookkeeper | INF 124 Group 27</p>
      </footer>
    </div>
  );
}

export default Welcome;