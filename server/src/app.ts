import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import compression from 'compression';
import { helmetMiddleware, corsMiddleware, apiLimiter } from './middleware/security.middleware';
import { errorHandler } from './middleware/error.middleware';
import apiRouter from './routes/index';

const app: Application = express();

// Compress all response payloads
app.use(compression());

// Security Middlewares
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use('/api', apiLimiter);

// Parsing Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging Middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/v1', apiRouter);

// Global Error Handler
app.use(errorHandler);

export default app;
