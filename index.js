const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables (supports atlas-credentials.env, root .env, backend .env, and production process.env)
dotenv.config({ path: path.resolve(__dirname, 'atlas-credentials.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, 'backend/.env') });

const connectDB = require('./backend/config/db');

// Initialize MongoDB Atlas connection
connectDB();

const app = express();

// Security and parser middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Backend API Routes
app.use('/api/auth', require('./backend/routes/auth'));
app.use('/api/properties', require('./backend/routes/properties'));
app.use('/api/inquiries', require('./backend/routes/inquiries'));
app.use('/api/reviews', require('./backend/routes/reviews'));
app.use('/api/roommates', require('./backend/routes/roommates'));
app.use('/api/lease', require('./backend/routes/lease'));

// Health Check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'GRIHO (গৃহ) Bangladesh House Rental Platform',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend static assets from Vite build output directory
const frontendDistPath = path.join(__dirname, 'frontend', 'dist');
app.use(express.static(frontendDistPath));

// SPA wildcard fallback for React Router (must be placed after all /api routes)
app.get('*', (req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API route not found' });
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
  });
});

// Port configuration for Render (Render sets process.env.PORT automatically)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 GRIHO Bangladesh Rental Platform Live`);
  console.log(`📡 Server running on port: ${PORT}`);
  console.log(`🌐 Local access: http://localhost:${PORT}`);
  console.log(`===============================================`);
});
