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

// Allow multiple origins for development and production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://internshiptask-lilac.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean).map(url => url.replace(/\/$/, ''));

// CORS configuration with dynamic origin
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Request-Private-Network'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  optionsSuccessStatus: 204
}));

// Explicit preflight handler for all routes
app.options('*', cors());

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
