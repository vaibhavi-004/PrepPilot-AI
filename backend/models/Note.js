/**
 * models/Note.js
 * Mongoose Schema for Personal Notes
 * 
 * Defines how notes are structured, linked to a specific user.
 */

const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a note title'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Please add note content'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now // Defaults to current date/time
  }
});

module.exports = mongoose.model('Note', NoteSchema);
