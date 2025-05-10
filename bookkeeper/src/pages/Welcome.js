import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import '../assets/globalStyles/global.css';
import './Welcome.css';

// Environment variable for the client ID
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

function Welcome() {
    const navigate = useNavigate();

    const onSuccess = async (response) => {
        console.log('Login Success:', response);

        try {
            //  Send the code to your server for verification and session creation
            const res = await fetch('http://localhost:5000/api/auth/google', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  code: response.code,
              }),
              credentials: 'include', // Add this line
          });

            const data = await res.json();

            if (res.ok) {
                //  Server successfully authenticated the user
                console.log("Server Response:", data);

                //  Store user session data (e.g., in localStorage)
                //  This depends on your session management strategy
                localStorage.setItem('user', JSON.stringify(data.user)); // Example

                //  Redirect to the main application page
                navigate('/reading-list');  //  <---  Adjust this to your desired page
            } else {
                //  Server returned an error
                console.error("Server Authentication Error:", data);
                //  Display an error message to the user
                alert('Authentication failed. Please try again.');
            }
        } catch (error) {
            //  Network error or other client-side error
            console.error("Error sending code to server:", error);
            alert('Could not connect to the server. Please try again.');
        }
    };

    const onFailure = (error) => {
        console.error('Login Failed:', error);
        //  Handle login errors (e.g., display a user-friendly message)
        alert('Google login failed. Please try again.');
    };

    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
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
                        <p>
                            Build your own personal library with BookKeeper!
                        </p>
                    </div>

                    <div className="auth-options">
                        <GoogleLogin
                            onSuccess={onSuccess}
                            onError={onFailure}
                            useOneTap={true} // Enable One Tap Sign-in
                            authorizationUrl={{
                                prompt: 'select_account',  //  Force account selection
                            }}
                            render={({ onClick, disabled }) => (
                                <button
                                    onClick={onClick}
                                    disabled={disabled}
                                    className="btn btn-secondary"
                                >
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
                                </button>
                            )}
                        />
                        <a href="#" className="btn btn-primary">Create Account</a>
                        <a href="#" className="btn btn-secondary">Login with Email</a>
                    </div>
                </div>

                <footer className="welcome-footer">
                    <p>&copy; 2025 Bookkeeper | INF 124 Group 27</p>
                </footer>
            </div>
        </GoogleOAuthProvider>
    );
}

export default Welcome;