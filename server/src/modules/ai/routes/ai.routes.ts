import { Router } from 'express';
import {
  getProvidersStatus,
  switchActiveProvider,
  generateAICompletion,
  generateContent,
  executeWritingAssistant,
  getGenerationHistory,
} from '../controllers/ai.controller';
import { authenticate } from '../../auth/middleware/auth.middleware';

const router = Router();

// Secure all AI engine endpoints with auth middleware
router.use(authenticate);

router.get('/providers', getProvidersStatus);
router.post('/switch-provider', switchActiveProvider);
router.post('/completion', generateAICompletion);
router.post('/generate', generateContent);
router.post('/assistant', executeWritingAssistant);
router.get('/history', getGenerationHistory);

export default router;
