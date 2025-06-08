// src/index.js (or main.jsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="647101852699-nrok2n877s78mj7nmvl1sal3ct86b0p3">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);