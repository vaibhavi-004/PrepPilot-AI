/**
 * routes/authRoutes.js
 * Authentication Routes
 * 
 * Maps authentication URLs to their respective controller functions.
 */

const express = require('express');
const router = express.Router();

const { registerUser, loginUser } = require('../controllers/authController');

// Route for user registration
// Calls the registerUser controller when client hits "POST /api/auth/register"
router.post('/register', registerUser);

// Route for user login
// Calls the loginUser controller when client hits "POST /api/auth/login"
router.post('/login', loginUser);

module.exports = router;
