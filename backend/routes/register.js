import User from '../models/User.js';
import crypto from 'crypto';
import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Generate a salt
    const salt = crypto.randomBytes(16).toString('hex');
  
    // Hash the password using the salt
    const hash = crypto.createHmac('sha256', salt)
      .update(password)
      .digest('hex');
    
    const user = {
      username,
      password: `${salt}:${hash}`,
      salt,
    };
    
    const newUser = await User.create(user);

    res.status(201).json({ message: 'User created successfully!' });
  } catch (err) {
    // Handle duplicate key error (code 11000)
    if(err.code === 11000 && err.keyPattern && err.keyPattern.username) {
      return res.status(401).json({ message: 'Username already exists. Please choose another one.'})
    }

    //handle other errors
    console.error('Error during registration', err);
    res.status(500).send({ message: 'Error creating user', error: err });
  }
});

export default router;