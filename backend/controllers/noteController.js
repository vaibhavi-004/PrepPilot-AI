/**
 * controllers/noteController.js
 * Notes Manager Controller
 * 
 * Handles CRUD operations for notes created by authenticated users.
 * Verifies ownership of each note before letting deletion occur.
 */

const Note = require('../models/Note');

/**
 * @desc    Get all notes for the logged-in user
 * @route   GET /api/notes
 * @access  Private
 */
const getNotes = async (req, res) => {
  try {
    // Retrieve all notes belonging to the authenticated user ID (req.user)
    const notes = await Note.find({ userId: req.user }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Add a new note
 * @route   POST /api/notes
 * @access  Private
 */
const addNote = async (req, res) => {
  const { title, content } = req.body;

  // Validate inputs
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    // Create and save note in MongoDB
    const note = await Note.create({
      userId: req.user,
      title,
      content
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete a note
 * @route   DELETE /api/notes/:id
 * @access  Private
 */
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Safety check: ensure logged-in user owns this note
    if (note.userId.toString() !== req.user) {
      return res.status(401).json({ message: 'Not authorized to delete this note' });
    }

    // Delete the note
    await Note.deleteOne({ _id: req.params.id });
    res.json({ message: 'Note deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotes,
  addNote,
  deleteNote
};
