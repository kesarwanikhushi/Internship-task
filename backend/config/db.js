const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      // already connected
      return;
    }
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set. Set process.env.MONGODB_URI to your MongoDB connection string');
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    // In serverless environments, exiting the process will crash the function.
    // Throw the error so the caller can decide how to handle it and so logs are preserved.
    throw error;
  }
};

module.exports = connectDB;
