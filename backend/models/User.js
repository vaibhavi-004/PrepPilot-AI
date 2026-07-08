/**
 * models/User.js
 * Mongoose Schema for the User collection
 * 
 * Defines how user credentials and info are structured in MongoDB.
 */

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true, // Prevents duplicate email signups
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters']
  }
}, {
  // Automatically manages 'createdAt' and 'updatedAt' field timestamps for us
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
