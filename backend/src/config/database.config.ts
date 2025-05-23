import mongoose from 'mongoose';
import { MONGO_URI } from '../utils/constants';
import logger from './logger';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI || '');
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
