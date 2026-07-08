/**
 * config/db.js
 * Database Connection Setup using Mongoose
 * 
 * This file establishes a connection to MongoDB (either local or Atlas).
 * It uses the 'MONGODB_URI' environment variable from the .env file.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Attempt to connect to the MongoDB URI configured in environmental variables.
    // Mongoose handles connection pooling automatically behind the scenes.
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`MongoDB Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit the Node.js application process with failure code (1) if connection fails.
    process.exit(1);
  }
};

module.exports = connectDB;
