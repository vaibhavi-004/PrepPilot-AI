/**
 * controllers/problemController.js
 * DSA Problems Tracker Controller
 * 
 * Handles CRUD operations for problems tracked by authenticated users.
 * Verifies ownership of each record before letting updates or deletes occur.
 */

const Problem = require('../models/Problem');

/**
 * @desc    Get all problems for the logged-in user
 * @route   GET /api/problems
 * @access  Private
 */
const getProblems = async (req, res) => {
  try {
    // req.user is set by the authMiddleware from the JWT token
    const problems = await Problem.find({ userId: req.user }).sort({ createdAt: -1 });
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Add a new DSA problem
 * @route   POST /api/problems
 * @access  Private
 */
const addProblem = async (req, res) => {
  const { title, difficulty, status } = req.body;

  // Basic validation
  if (!title || !difficulty) {
    return res.status(400).json({ message: 'Title and difficulty are required' });
  }

  try {
    // Save new problem document to MongoDB
    const problem = await Problem.create({
      userId: req.user, // linked user
      title,
      difficulty,
      status: status || 'Not Started'
    });

    res.status(201).json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update a DSA problem
 * @route   PUT /api/problems/:id
 * @access  Private
 */
const updateProblem = async (req, res) => {
  const { title, difficulty, status } = req.body;

  try {
    // Find the problem first to check ownership
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Safety check: ensure logged-in user owns this problem
    if (problem.userId.toString() !== req.user) {
      return res.status(401).json({ message: 'Not authorized to edit this problem' });
    }

    // Update fields if provided in request body
    problem.title = title || problem.title;
    problem.difficulty = difficulty || problem.difficulty;
    problem.status = status || problem.status;

    const updatedProblem = await problem.save();
    res.json(updatedProblem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete a DSA problem
 * @route   DELETE /api/problems/:id
 * @access  Private
 */
const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Safety check: ensure logged-in user owns this problem
    if (problem.userId.toString() !== req.user) {
      return res.status(401).json({ message: 'Not authorized to delete this problem' });
    }

    // Remove the problem from MongoDB using deleteOne
    await Problem.deleteOne({ _id: req.params.id });
    res.json({ message: 'Problem deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProblems,
  addProblem,
  updateProblem,
  deleteProblem
};
