// routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { expressjwt as expressJwt } from 'express-jwt';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);  // Assuming matchPassword method is defined in User model
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Sign the JWT token with user information
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }  // Token expires in 1 hour
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware for verifying JWT token
const authMiddleware = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  userProperty: 'auth', // Store decoded token in req.auth
}).unless({
  path: [
    // Allow non-protected routes (e.g., login, register)
    '/auth/login',
    '/auth/register',
  ]
});

// Example of a protected route using the middleware
router.get('/protected', authMiddleware, (req, res) => {
  // If the request passes through the middleware, we know the user is authenticated
  res.send('You have access to this route!');
});

export default authMiddleware;
