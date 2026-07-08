/**
 * routes/aiRoutes.js
 * AI Prep Interview Questions Routes
 * 
 * Maps AI URLs to their respective controller functions.
 * Protects all routes to ensure authenticated usage.
 */

const express = require('express');
const router = express.Router();

const { generateQuestions } = require('../controllers/aiController');

// Import authentication protection middleware
const { protect } = require('../middleware/authMiddleware');

// Protect the route using the protect middleware
router.post('/questions', protect, generateQuestions);

module.exports = router;
