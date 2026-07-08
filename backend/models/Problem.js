/**
 * models/Problem.js
 * Mongoose Schema for the DSA Tracker Problems
 * 
 * Defines how problems are structured in MongoDB, linked to a specific user.
 */

const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a problem title'],
    trim: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard'] // Limits difficulty values to these three options
  },
  status: {
    type: String,
    required: true,
    enum: ['Solved', 'Attempted', 'Not Started'], // Limits status values
    default: 'Not Started'
  },
  createdAt: {
    type: Date,
    default: Date.now // Defaults to current date/time
  }
});

module.exports = mongoose.model('Problem', ProblemSchema);
