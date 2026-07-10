import { Router, Request, Response } from 'express';
import aiRoutes from '../modules/ai/routes/ai.routes';
import promptRoutes from '../modules/prompts/routes/prompt.routes';
import chatRoutes from '../modules/ai-chat/routes/chat.routes';
import { authRouter } from '../modules/auth/routes/auth.routes';
import { aiRegistryService } from '../modules/ai/services/ai-registry.service';
import mongoose from 'mongoose';

const router = Router();

// Health Check Endpoint
router.get('/health', async (_req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const activeProvider = aiRegistryService.getActiveProviderId();
  const providers = await aiRegistryService.getProvidersStatus();

  res.status(200).json({
    success: true,
    status: 'online',
    system: 'Neurova Enterprise Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
    },
    aiEngine: {
      activeProvider,
      providersCount: providers.length,
      availableProviders: providers.map((p: { id: string; name: string; isHealthy: boolean }) => ({
        id: p.id,
        name: p.name,
        isHealthy: p.isHealthy,
      })),
    },
  });
});

// Register Module Routes
router.use('/auth', authRouter);
router.use('/ai', aiRoutes);
router.use('/prompts', promptRoutes);
router.use('/chat', chatRoutes);

export default router;
