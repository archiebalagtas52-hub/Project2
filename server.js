import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/', authRoutes);
app.use('/', menuRoutes);

// 404
app.use((req, res) => {
  res.status(404).send('Not found');
});

// Start server
async function startServer() {
  await connectDB();
  app.listen(port, () => {
    console.log('Running on http://localhost:' + port);
  });
}

startServer();
