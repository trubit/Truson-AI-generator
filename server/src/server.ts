import app from './app';
import { env } from './config/env.config';
import { logger } from './config/logger.config';
import { connectDatabase } from './database/connection';
import cluster from 'cluster';
import os from 'os';

const numCPUs = os.cpus().length;

const startServer = async () => {
  try {
    // 1. Initialize MongoDB Connection
    await connectDatabase();

    // 2. Start Express HTTP Listener
    const PORT = env.PORT || 5050;
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Neurova Server Worker ${process.pid} running on http://localhost:${PORT}`);
    });

    // Graceful Shutdown Handler
    const shutdown = (signal: string) => {
      logger.warn(`Worker ${process.pid} received ${signal}. Shutting down server gracefully...`);
      server.close(() => {
        logger.info(`Worker ${process.pid} HTTP server closed.`);
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error(`❌ Failed to start Neurova Worker ${process.pid}: ${error}`);
    process.exit(1);
  }
};

if (env.NODE_ENV === 'production' && cluster.isPrimary) {
  logger.info(`Primary Neurova Server ${process.pid} is running`);
  logger.info(`Forking ${numCPUs} CPU cores for parallel thread execution...`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} died (code: ${code}, signal: ${signal}). Spawning a replacement worker...`);
    cluster.fork();
  });
} else {
  if (env.NODE_ENV !== 'production') {
    logger.info(`Environment: ${env.NODE_ENV} (Clustering disabled in development mode)`);
  }
  startServer();
}
