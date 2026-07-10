import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from '../config/env.config';
import Redis from 'ioredis';
import RedisStore from 'rate-limit-redis';
import { logger } from '../config/logger.config';

export const helmetMiddleware = helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman) or dev localhost origins
    if (
      !origin ||
      env.NODE_ENV === 'development' ||
      origin === env.CLIENT_URL ||
      /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation: Origin not allowed.'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});

let rateLimitStore: any = undefined;

if (env.REDIS_URL) {
  try {
    const redisClient = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
    });
    redisClient.on('error', (err) => {
      logger.error(`Redis rate-limit store error: ${err}`);
    });
    redisClient.on('connect', () => {
      logger.info('✅ Redis connected successfully for distributed rate-limiting');
    });
    rateLimitStore = new RedisStore({
      // @ts-expect-error ioredis sendCommand type mismatch with rate-limit-redis
      sendCommand: (...args: string[]) => redisClient.call(args[0], ...args.slice(1)),
    });
  } catch (err) {
    logger.error(`Failed to initialize Redis client for rate limiting: ${err}`);
  }
}

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  store: rateLimitStore,
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again later.',
      statusCode: 429,
    },
  },
});
