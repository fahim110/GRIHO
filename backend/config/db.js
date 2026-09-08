const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from atlas-credentials.env, root .env, or backend .env
dotenv.config({ path: path.resolve(__dirname, '../../atlas-credentials.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    if (!uri) {
      console.warn('[MongoDB Warning]: MONGODB_URI is not defined in environment variables.');
      return;
    }

    // Ensure database name is included
    if (!uri.includes('griho_db')) {
      if (uri.includes('?')) {
        uri = uri.replace('?', 'griho_db?');
      } else {
        uri = uri.endsWith('/') ? `${uri}griho_db` : `${uri}/griho_db`;
      }
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Error]: ${error.message}`);
    // Do not call process.exit(1) to keep the API server alive and responsive
  }
};

module.exports = connectDB;
