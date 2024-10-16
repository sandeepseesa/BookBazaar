// @ts-nocheck
import express from "express";
import mongoose from "mongoose";
import bookRoute from "./routes/bookRoute.js";
import cors from 'cors';
import register from "./routes/register.js";
import login from "./routes/login.js";
import dotenv from 'dotenv';
import passport from './config.js/passport.js';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());

dotenv.config();

app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set secure to true in production with HTTPS
}));

//option 1: Allow all Origins with Default of cors(*)
// app.use(cors());

//Option 2: Allow Custom Origins
app.use(cors(
  {
    origin: 'https://bookbazaar-client.onrender.com',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  }
));


app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

app.use('/books', bookRoute);

//register
app.use('/register', register);


// Login
app.use('/login', login);

const port = process.env.PORT || 3000;

// Route to start the Google authentication process
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Callback route that Google will redirect to after authentication
app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/login'
}), (req, res) => {
  if (req.user) {
    const token = jwt.sign(
      { id: req.user.id, username: req.user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Redirect the user back to the frontend (can customize the path as needed)
    res.redirect(`http://localhost:5173/?token=${encodeURIComponent(token)}`);
  } else {
    res.status(400).json({ error: 'User authentication filed' })
  }
});

// Route 3: Check for the token and send it to the frontend
app.get('/check-token', (req, res) => {
  // Retrieve the token from the Authorization header
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  // const token = req.cookies.token;

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  if (token) {
    //Verify the token before sending it to the frontend
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      } else {
        return res.json({ message: 'Token is valid', user: decoded });
      }
    });
  } else {
    return res.status(400).json({ error: 'No token' });
  }
});

// Logout route
app.post('/logout', (req, res) => {
  // Check if the user is logged in
  if (req.user) {

    // For Google login or session-based login, logout user from the session
    req.logout((err) => {
      if (err) {
        return res.status(500).send({ message: 'Failed to log out' });
      }
    });
  } else {
    // For JWT-based (manual) login, just return success
    res.status(200).send({ message: 'Logged out successfully' });
  }
});


//connect database and server
mongoose.connect(process.env.mongoURL)
  .then(() => {
    console.log("MongoDB COnnected!");

    app.listen(port, () => {
      console.log(`Server running on PORT: ${port}`)
    });
  })
  .catch((err) => {
    console.log(err);
  })