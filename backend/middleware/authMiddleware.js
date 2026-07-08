/**
 * middleware/authMiddleware.js
 * JWT Authentication Middleware
 * 
 * Intercepts incoming HTTP requests to protected routes, extracts the JSON Web Token,
 * verifies its signature, and appends the authenticated user's ID to the request object.
 */

const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;

  // Check if token exists in the HTTP Authorization headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Headers typically look like: "Bearer <JWT-token-string>"
      // Split by space and take the second index (the token)
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user ID from the token payload to the request object (req.user)
      // This allows subsequent routes to easily identify which user is making the request
      req.user = decoded.id;

      // Pass control to the next middleware or controller in the route pipeline
      next();
    } catch (error) {
      console.error('Authentication Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed or expired' });
    }
  }

  // If no token is provided at all
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
