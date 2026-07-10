import mongoose from 'mongoose';
import { env } from '../config/env.config';
import { logger } from '../config/logger.config';

export const connectDatabase = async (): Promise<typeof mongoose> => {
  try {
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 500,
      minPoolSize: 50,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });

    logger.info(`✅ MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      logger.error(`❌ MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB connection disconnected.');
    });

    return conn;
  } catch (error) {
    logger.warn(`⚠️ MongoDB initial connection failed (Running in fallback mode if offline): ${error}`);
    // Non-fatal for dev bootstrapping if MongoDB is not running locally yet
    return mongoose;
  }
};
