import '../assets/globalStyles/global.css';
import './Welcome.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { GoogleLogin } from '@react-oauth/google'; // Import GoogleLogin
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode

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

  // --- Google Login Handlers ---
  const handleGoogleLoginSuccess = async (credentialResponse) => {
      console.log("Google ID Token:", credentialResponse.credential); // <-- ADD THIS LINE
    try {
      // Decode the JWT token to get user information
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('Google Login Success - Decoded User Info:', decoded);

      // Send the Google credential to your backend for verification and user management
      // This is crucial for security and creating a session on your server
      const res = await API.post('/auth/google', { token: credentialResponse.credential });

      localStorage.setItem('token', res.data.token); // Store your backend's token
      setStatus('Google login successful!');
      setTimeout(() => navigate('/notes'), 500);

    } catch (error) {
      console.error('Google login failed:', error);
      setStatus('Google login failed. Please try again.');
    }
  };

  const handleGoogleLoginError = () => {
    console.log('Google Login Failed');
    setStatus('Google login failed. Please try again.');
  };
  // --- End Google Login Handlers ---


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
          {/* Replace the anchor tag with the GoogleLogin component */}
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            // You can customize the button style if needed.
            // For example, to match your existing button styles, you might need custom rendering
            // For now, it will render the default Google button.
            // theme="outline"
            // size="large"
            // text="signin_with"
          />
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