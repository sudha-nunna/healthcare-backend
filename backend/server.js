require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const BASE_PORT = Number(process.env.PORT) || 4001;

// CORS: include deployed frontend URL (Vercel) and local dev URLs
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:8081',
  'http://127.0.0.1:8080',
  'https://healthcare-project-ten.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);
app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());
app.use('/uploads', express.static(process.env.UPLOAD_DIR || 'uploads'));

// connect to MongoDB
connectDB();

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/slots', require('./routes/slots'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/specialists', require('./routes/specialists'));
app.use('/api/insurance', require('./routes/insurance'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/prices', require('./routes/prices'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/upload', require('./routes/upload'));
// Dentist booking platform (added without changing existing routes)
app.use('/api/dentists', require('./routes/dentists'));
app.use('/api/dentist-appointments', require('./routes/dentist-appointments'));

// Health check endpoint (report configured base port; actual listen port is logged at startup)
app.get('/', (req, res) =>
  res.json({ ok: true, message: 'Care Compare backend running', port: BASE_PORT })
);
app.get('/health', (req, res) =>
  res.json({ status: 'ok', port: BASE_PORT, timestamp: new Date().toISOString() })
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

function startServer(port, attempt = 0) {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);
    console.log(`Test endpoint (relative): /api/specialists`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      const hasExplicitPort = Boolean(process.env.PORT);
      const canFallback = !hasExplicitPort && attempt < 10;
      const nextPort = port + 1;

      console.error(`Port ${port} is already in use.`);
      if (canFallback) {
        console.log(`Trying port ${nextPort}... (set PORT in .env to pin a port)`);
        startServer(nextPort, attempt + 1);
        return;
      }

      console.error(
        `Cannot start server. Free up port ${port} or set a different PORT in your environment.`
      );
      process.exit(1);
    }

    console.error('Server failed to start:', err);
    process.exit(1);
  });
}

startServer(BASE_PORT);
