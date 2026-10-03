import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
  try {
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    await mongoose.connect(MONGO_URI);

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

export default connectDB;
