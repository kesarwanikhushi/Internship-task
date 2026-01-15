const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();

const app = express();

// For a long-running service we want to connect to the DB before starting the server.
// If the DB connection fails on startup we exit so the host (Render) can retry/deploy accordingly.

// Normalize FRONTEND_URL to avoid trailing-slash mismatch with browser origin
const rawFrontEnd = process.env.FRONTEND_URL || 'https://internshiptask-lilac.vercel.app';
const FRONTEND_URL = rawFrontEnd.replace(/\/$/, '');

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Request-Private-Network'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Allow Private Network Access preflight responses for browsers that request it
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', FRONTEND_URL);
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Access-Control-Request-Private-Network');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.headers['access-control-request-private-network']) {
    res.header('Access-Control-Allow-Private-Network', 'true');
  }
  return res.sendStatus(204);
});

app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Task Management API is running', status: 'ok' });
});

app.get('/api', (req, res) => {
  res.json({ message: 'Task Management API is running', status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database first
    await connectDB({ attempts: 5, delayMs: 3000, serverSelectionTimeoutMS: 30000 });
    
    // Only start the server after DB connection succeeds
    if (require.main === module) {
      const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });

      server.on('error', (err) => {
        if (err && err.code === 'EADDRINUSE') {
          console.error(`Port ${PORT} is already in use. Kill the process using it or set a different PORT.`);
        } else {
          console.error('Server error:', err);
        }
        process.exit(1);
      });
    }
  } catch (err) {
    console.error('Initial MongoDB connection failed, exiting process:', err.message);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
