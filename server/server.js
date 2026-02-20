/**
 * Travel Booking API - Server Entry Point
 * MERN Stack Backend - Production Ready
 */

require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');


const PORT = process.env.PORT || 5000;

let server;

// Connect to MongoDB before starting server
connectDB()
  .then(() => {
    server = app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    });



  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

/**
 * Handle Unhandled Promise Rejections
 */
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

/**
 * Handle Uncaught Exceptions
 */
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});

/**
 * Graceful Shutdown
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');

  if (server) {
    server.close(() => {
      console.log('Process terminated.');
    });
  }
});
