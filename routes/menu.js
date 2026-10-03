import express from 'express';
import requireAuth from '../middleware/auth.js';

const router = express.Router();

const ITEMS = [
  'Start Game',
  'New Game',
  'Load Game',
  'Survival',
  'Character Selection',
  'Weapons Arsenal',
  'Training',
  'Settings',
  'Exit Game',
];

router.get('/', requireAuth, (req, res) => {
  res.render('menu', {
    items: ITEMS,
    username: req.user.username,
  });
});

export default router;
