import { Router } from 'express';
import { getProvidersStatus, switchActiveProvider, generateAICompletion } from '../controllers/ai.controller';

const router = Router();

router.get('/providers', getProvidersStatus);
router.post('/switch-provider', switchActiveProvider);
router.post('/completion', generateAICompletion);

export default router;
