const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    const token = jwt.sign({ _id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    res.json({ token, user: safeUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ _id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
      const safeUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        favorites: user.favorites,
        savedSearches: user.savedSearches,
      };
      res.json({ token, user: safeUser });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/user', async (req, res) => {
  try {
    const users = await User.find();
    const safeUsers = users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }));
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();
    const updatedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    res.json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;