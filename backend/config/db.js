const mongoose = require('mongoose');

const connectDB = async (opts = {}) => {
  const maxAttempts = opts.attempts || 3;
  const delayMs = opts.delayMs || 2000;
  const selectionTimeout = opts.serverSelectionTimeoutMS || 10000;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Set process.env.MONGODB_URI to your MongoDB connection string');
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      if (mongoose.connection.readyState === 1) {
        console.log('MongoDB already connected');
        return;
      }

      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: selectionTimeout
      });

      console.log('MongoDB connected');
      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt} failed:`, error.message);
      if (attempt < maxAttempts) {
        // wait before retrying
        await new Promise((res) => setTimeout(res, delayMs));
      } else {
        // final failure
        throw error;
      }
    }
  }
};

module.exports = connectDB;
