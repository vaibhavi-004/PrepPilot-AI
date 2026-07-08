/**
 * routes/problemRoutes.js
 * DSA Problems Tracker Routes
 * 
 * Maps problem URLs to their respective controller functions.
 * Protects all routes using the protect middleware to ensure only logged-in users access them.
 */

const express = require('express');
const router = express.Router();

const { 
  getProblems, 
  addProblem, 
  updateProblem, 
  deleteProblem 
} = require('../controllers/problemController');

// Import authentication protection middleware
const { protect } = require('../middleware/authMiddleware');

// Protect all routes in this file (applies 'protect' middleware to all requests)
router.use(protect);

// Maps "GET /api/problems" (fetch list) and "POST /api/problems" (create problem)
router.route('/')
  .get(getProblems)
  .post(addProblem);

// Maps "PUT /api/problems/:id" (update details) and "DELETE /api/problems/:id" (delete)
router.route('/:id')
  .put(updateProblem)
  .delete(deleteProblem);

module.exports = router;
