const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../atlas-credentials.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/roommates', require('./routes/roommates'));
app.use('/api/lease', require('./routes/lease'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'GRIHO (গৃহ) Bangladesh Rental Platform API',
    timestamp: new Date().toISOString(),
  });
});

// Fallback error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);
  res.status(500).json({ success: false, message: 'Server Internal Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 GRIHO Server running on port http://localhost:${PORT}`);
});
