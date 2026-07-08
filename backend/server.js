/**
 * server.js
 * Express Server Entrypoint for PrepPilot AI
 * 
 * Sets up environment variables, connects to the MongoDB database,
 * configures middleware (CORS, JSON parser, static files serving),
 * registers API endpoints, and starts the server listening on a port.
 */

// Load Environment Variables from backend/.env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Initialize the Express Application
const app = express();

// Establish connection to MongoDB Atlas / Local Database
connectDB();

// --- MIDDLEWARE CONFIGURATION ---

// Enable Cross-Origin Resource Sharing (CORS)
// This permits our frontend (running on a different port/domain) to communicate with this backend.
app.use(cors());

// Parse incoming requests with JSON payloads (alternative to body-parser)
app.use(express.json());

// Parse URL-encoded payloads
app.use(express.urlencoded({ extended: false }));

// --- API ROUTE DEFINITIONS ---

// Mount router modules under '/api/...' paths
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/problems', require('./routes/problemRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// --- SERVING STATIC FRONTEND FILES ---
// This serves all HTML/CSS/JS frontend files directly from the backend server.
// It simplifies local setup and deployment (e.g., Render) to a single running service.
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Redirect any unmatched GET requests to the index.html page (for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// --- ERROR HANDLING MIDDLEWARE ---
// A fallback error catcher to ensure any unhandled errors respond with clean JSON.
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(`[Error Middleware] ${err.stack}`);
  res.status(statusCode).json({
    message: err.message,
    // Only return the stack trace during development to protect server secrets
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// --- SERVER STARTUP ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`PrepPilot AI Backend running on port ${PORT}`);
  console.log(`Serving frontend files from: ${frontendPath}`);
});
