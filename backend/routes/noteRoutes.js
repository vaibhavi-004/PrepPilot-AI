/**
 * routes/noteRoutes.js
 * Notes Manager Routes
 * 
 * Maps notes URLs to their respective controller functions.
 * Protects all routes to ensure user data isolation.
 */

const express = require('express');
const router = express.Router();

const { 
  getNotes, 
  addNote, 
  deleteNote 
} = require('../controllers/noteController');

// Import authentication protection middleware
const { protect } = require('../middleware/authMiddleware');

// Protect all routes in this file
router.use(protect);

// Maps "GET /api/notes" (retrieve user notes) and "POST /api/notes" (create new note)
router.route('/')
  .get(getNotes)
  .post(addNote);

// Maps "DELETE /api/notes/:id" (delete specified note)
router.route('/:id')
  .delete(deleteNote);

module.exports = router;
