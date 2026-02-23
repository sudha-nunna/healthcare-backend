require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 4000;

// CORS: include deployed frontend URL (Vercel) and local dev URLs
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080',
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

// Health check endpoint
app.get('/', (req, res) => res.json({ ok: true, message: 'Care Compare backend running', port: PORT }));
app.get('/health', (req, res) => res.json({ status: 'ok', port: PORT, timestamp: new Date().toISOString() }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);
  console.log(`Test endpoint (relative): /api/specialists`);
});

