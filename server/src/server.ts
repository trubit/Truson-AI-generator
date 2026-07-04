import app from './app';
import { env } from './config/env.config';
import { logger } from './config/logger.config';
import { connectDatabase } from './database/connection';

const startServer = async () => {
  try {
    // 1. Initialize MongoDB Connection
    await connectDatabase();

    // 2. Start Express HTTP Listener
    const PORT = env.PORT || 5050;
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Truson-AI-Generator Server running on http://localhost:${PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
      logger.info(`Client URL: ${env.CLIENT_URL}`);
    });

    // Graceful Shutdown Handler
    const shutdown = (signal: string) => {
      logger.warn(`Received ${signal}. Shutting down server gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error(`Fatal server bootstrap failure: ${error}`);
    process.exit(1);
  }
};

startServer();
