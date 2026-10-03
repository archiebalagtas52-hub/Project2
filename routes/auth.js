import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

function setToken(res, user) {
  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  });
}

router.get('/register', (req, res) => res.render('register', { error: null }));

router.post('/register', async (req, res) => {
  const { username = '', password = '' } = req.body;
  const name = username.trim();

  if (name.length < 3 || name.length > 20 || password.length < 6) {
    return res.status(400).render('register', { error: 'Username needs 3-20 characters and password 6+.' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ username: name, passwordHash });
    setToken(res, user);
    res.redirect('/');
  } catch (err) {
    console.error('Register error:', err); // the real cause shows in your terminal

    let msg = 'Could not register. Try again.';
    if (err.code === 11000) msg = 'That username is taken.';
    else if (err.name === 'ValidationError') msg = 'Username needs 3-20 characters.';
    else if (!process.env.JWT_SECRET) msg = 'Server setup problem: JWT_SECRET is missing in .env.';

    res.status(400).render('register', { error: msg });
  }
});

router.get('/login', (req, res) => res.render('login', { error: null }));

router.post('/login', async (req, res) => {
  const { username = '', password = '' } = req.body;
  const user = await User.findOne({ username: username.trim() });
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) return res.status(401).render('login', { error: 'Wrong username or password.' });
  setToken(res, user);
  res.redirect('/');
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

export default router;
