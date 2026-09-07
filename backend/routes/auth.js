const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be configured in the environment');
}

const generateTokens = (user) => {
  const claims = { id: user._id, email: user.email, role: user.role, isSuperAdmin: user.isSuperAdmin === true };
  const accessToken = jwt.sign({ ...claims, type: 'access' }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ ...claims, type: 'refresh' }, JWT_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

// Customer Registration
router.post('/register', async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password, confirmPassword } = req.body;
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Email, password, and confirmPassword are required' });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    if (password.length < 4) {
      return res.status(400).json({ message: 'Password must be at least 4 characters' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role: 'CUSTOMER' });
    await user.save();
    res.status(201).json({ message: 'Customer registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Customer Login
router.post('/login/customer', async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    const user = await User.findOne({ email, role: 'CUSTOMER' });
    if (!user) return res.status(400).json({ message: 'Invalid credentials or not a customer' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.json(generateTokens(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Login
router.post('/login/admin', async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    const user = await User.findOne({ email, role: 'ADMIN' });
    if (!user) return res.status(400).json({ message: 'Invalid credentials or not an admin' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.json(generateTokens(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Creation (Protected)
router.post('/create-admin', auth(['ADMIN']), async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const seedAdminEmail = (process.env.SEED_ADMIN_EMAIL || 'admin@test.com').toLowerCase();
    if (req.user.email !== seedAdminEmail && !req.user.isSuperAdmin) {
      return res.status(403).json({ message: 'Only the seeded admin or a super admin can create admins' });
    }
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: 'A valid admin email is required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    
    const user = new User({ email, password: hashedPassword, role: 'ADMIN' });
    await user.save();
    
    res.status(201).json({ message: 'Admin created successfully', password: randomPassword, email: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Refresh Token
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

  jwt.verify(refreshToken, JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid refresh token' });
    if (decoded.type !== 'refresh') return res.status(403).json({ message: 'Refresh token required' });
    
    const user = await User.findById(decoded.id);
    if (!user) return res.status(403).json({ message: 'User not found' });

    const tokens = generateTokens(user);
    res.json(tokens);
  });
});

module.exports = router;
