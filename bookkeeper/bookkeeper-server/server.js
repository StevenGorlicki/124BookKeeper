// --- Server Setup (Node.js with Express) ---
const express = require('express');
const { google } = require('googleapis');
const mongoose = require('mongoose');
const session = require('express-session'); // For session management
const cors = require('cors');  // For handling cross-origin requests

require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookkeeper', { // Fallback to local
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- Define User Schema and Model ---
const UserSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    // Add any other user-related fields you need (e.g., avatar, roles)
});

const User = mongoose.model('User', UserSchema);

// --- Middleware ---
app.use(cors({
    origin: 'http://localhost:3000',  // Or your frontend's actual URL
    credentials: true, // Allow sending cookies from the frontend
}));

//  Use the body parser middleware BEFORE defining routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(express.text({ type: 'text/*' }));  //  Add this line to handle plain text


// Session configuration (Important for maintaining user login state)
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key', // Use a strong, random secret from .env
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', //  Set to true in production for HTTPS
        httpOnly: true, //  Important security measure:  Don't allow client-side JS to access the cookie
        maxAge: 24 * 60 * 60 * 1000, //  Session duration: 24 hours (in milliseconds)
        sameSite: 'lax' // Or 'strict', depending on your needs
    },
}));


// --- Google OAuth 2.0 Configuration ---
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback';  // Important:  Make sure this matches your Google Cloud Console

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

// --- Routes ---

// 1.  Route to initiate Google Login (Generate the URL) -  Not directly used with @react-oauth/google, but kept for reference
app.get('/api/auth/google/login', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline', // 'offline' for refresh token, 'online' for just access token
        scope: ['profile', 'email'], //  Request user profile and email information
        prompt: 'select_account',  //  Force user to select an account
    });
    res.json({ url: authUrl }); //  Send the URL to the client
});

app.options('/api/auth/google', cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// 2.  Callback route to handle Google's response (Authorization code is sent here)
app.post('/api/auth/google', async (req, res) => {
    const { code } = req.body;  //  Get the code from the client
    if (!code) {
        return res.status(400).json({ error: 'Authorization code is required' });
    }

    try {
        // 1. Exchange the authorization code for tokens
        const tokenResponse = await oauth2Client.getToken({
            code: code,
        });

        const { tokens } = tokenResponse;
        oauth2Client.setCredentials(tokens); //  For subsequent API calls if needed

        // 2.  Get user information from Google
        const userInfoResponse = await google.oauth2('v2').userinfo.get({
            auth: oauth2Client,
        });
        const { id, email, name } = userInfoResponse.data;

        // 3.  Find or create user in your database
        let user = await User.findOne({ googleId: id });
        if (!user) {
            user = new User({
                googleId: id,
                email,
                name,
            });
            await user.save();
        }

        // 4.  Establish a session (using express-session)
        req.session.userId = user._id;  //  Store the user ID in the session
        req.session.save((err) => {
            if (err) {
                console.error("Error saving session:", err);
                return res.status(500).json({ error: 'Failed to save session' });
            }
             // 5. Send successful response
            res.json({
                success: true,
                message: 'Successfully authenticated with Google',
                user: { id: user._id, email: user.email, name: user.name }, //  Send back user data
            });
        });



    } catch (error) {
        console.error('Error during Google authentication:', error);
        res.status(500).json({ error: 'Failed to authenticate with Google' });
    }
});

// 3.  Route to get the logged-in user's data (Example) -  Protect this route!
app.get('/api/user/me', (req, res) => {
    if (req.session.userId) {
        User.findById(req.session.userId)
            .then(user => {
                if (user) {
                    res.json({
                        success: true,
                        user: { id: user._id, email: user.email, name: user.name },
                    });
                } else {
                    res.status(404).json({ error: 'User not found' }); //  Shouldn't happen, but handle it
                }

            })
            .catch(err => {
                console.error("Error fetching user:", err);
                res.status(500).json({ error: 'Internal server error' });
            })
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

// 4. Route to handle logout
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ error: 'Failed to logout' });
    }
    // Clear any client-side session data (e.g., localStorage)
    res.json({ success: true, message: 'Logged out successfully' });
  });
});



// --- Start the server ---
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

