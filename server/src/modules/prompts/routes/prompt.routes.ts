import { Router } from 'express';
import {
  getPromptMetadata,
  preparePrompt,
  getPromptHistory,
  toggleFavoritePrompt,
} from '../controllers/prompt.controller';
import { authenticate } from '../../auth/middleware/auth.middleware';

const router = Router();

// Secure all prompt routes with auth middleware
router.use(authenticate);

router.get('/metadata', getPromptMetadata);
router.post('/prepare', preparePrompt);
router.post('/generate', preparePrompt); // Alias endpoint matching REST guidelines
router.get('/history', getPromptHistory);
router.post('/favorites/:id', toggleFavoritePrompt);

export default router;
