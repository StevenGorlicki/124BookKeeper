import '../assets/globalStyles/global.css';
import './Welcome.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

function Welcome() {
  const [modalType, setModalType] = useState(null); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const navigate = useNavigate();

  const closeModal = () => {
    setModalType(null);
    setEmail('');
    setPassword('');
    setStatus('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setStatus('Login successful!');
      setTimeout(() => navigate('/notes'), 500);
    } catch (err) {
      setStatus(err.response?.data?.msg || 'Login failed');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/signup', { email, password });
      setStatus('Account created! You can now log in.');
      setModalType('login'); // Switch to login
    } catch (err) {
      setStatus(err.response?.data?.msg || 'Signup failed');
    }
  };

  return (
    <div className="welcome-container">
      <header>
        <h1>Welcome to BookKeeper</h1>
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
          <p>Build your own personal library with BookKeeper!</p>
        </div>

        <div className="auth-options">
          <a href="#" className="btn btn-secondary">Login with Google</a>
          <button className="btn btn-primary" onClick={() => setModalType('signup')}>Create Account</button>
          <button className="btn btn-secondary" onClick={() => setModalType('login')}>Login with Email</button>
        </div>
      </div>

      {modalType && (
        <div className="login-modal">
          <form className="login-form" onSubmit={modalType === 'login' ? handleLogin : handleSignup}>
            <h3>{modalType === 'login' ? 'Log In' : 'Create Account'}</h3>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">
              {modalType === 'login' ? 'Login' : 'Sign Up'}
            </button>
            {status && <p>{status}</p>}
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
          </form>
        </div>
      )}

      <footer className="welcome-footer">
        <p>&copy; 2025 Bookkeeper | INF 124 Group 27</p>
      </footer>
    </div>
  );
}

export default Welcome;
