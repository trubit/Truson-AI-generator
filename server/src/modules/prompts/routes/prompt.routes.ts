import { Router } from 'express';
import { getPromptMetadata, preparePrompt } from '../controllers/prompt.controller';

const router = Router();

router.get('/metadata', getPromptMetadata);
router.post('/prepare', preparePrompt);

export default router;
