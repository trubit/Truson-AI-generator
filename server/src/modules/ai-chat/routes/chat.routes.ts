import { Router } from 'express';
import {
  createConversation,
  listConversations,
  updateConversation,
  deleteConversation,
  listMessages,
  sendMessage,
  deleteMessage,
  exportConversation,
} from '../controllers/chat.controller';
import { authenticate } from '../../auth/middleware/auth.middleware';

const router = Router();

// Apply auth middleware to protect all AI Chat routes
router.use(authenticate);

// Conversations Routes
router.post('/conversations', createConversation);
router.get('/conversations', listConversations);
router.patch('/conversations/:id', updateConversation);
router.delete('/conversations/:id', deleteConversation);

// Messages Routes
router.get('/conversations/:id/messages', listMessages);
router.post('/conversations/:id/messages', sendMessage);
router.delete('/conversations/:id/messages/:msgId', deleteMessage);

// Export Route
router.post('/conversations/:id/export', exportConversation);

export default router;
