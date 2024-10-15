import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import express from 'express';
import crypto from 'crypto';
import dotenv from 'dotenv'; 

dotenv.config();

const router = express.Router();

const jwtSecret = process.env.JWT_SECRET;

router.post('/',  async (req, res) => {
  try {

    const { username, password } = req.body;
     // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username'});
    }

    // Extract salt and hashed password from the user record
    const { salt, password: hash} = user;

    // Hash the provided password using the stored salt
    const hashInput = crypto.createHmac('sha256', user.salt)
      .update(password)
      .digest('hex');

    // Check if the hashed password matches the stored password
    if (hashInput !== hash.split(':')[1]) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }

    // Generate a JWT token on successful login
    const token = jwt.sign({ id: user._id, username: user.username }, jwtSecret, {
      expiresIn: '1h'
    });

    // Send the token in response
    res.status(200).json({ message: 'Logged in successfully!', token });
   
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server error', error: err.message });
  }
})


export default router;