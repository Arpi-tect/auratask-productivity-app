const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/task_manager', {
      serverSelectionTimeoutMS: 5000 // Fast timeout (5 seconds) so it doesn't hang
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\n[Database Error] Local MongoDB is not running!`);
    console.warn(`[Status] The server will keep running on port 5000 so you can test the frontend.`);
    console.warn(`[Status] Note: Database operations will fail until MongoDB is connected.`);
    console.warn(`[Status] To enable cloud database, set a MONGO_URI in your backend/.env file.\n`);
  }
};

module.exports = connectDB;
