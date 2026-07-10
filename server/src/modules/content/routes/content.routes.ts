import { Router } from 'express';
import { contentController } from '../controllers/content.controller';
import { authenticate } from '../../auth/middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', contentController.create);
router.get('/', contentController.list);
router.get('/templates', contentController.listTemplates);
router.post('/generate', contentController.generate);
router.get('/:id', contentController.getById);
router.put('/:id', contentController.update);
router.delete('/:id', contentController.delete);
router.get('/:id/export', contentController.export);

router.get('/:id/versions', contentController.getVersions);
router.post('/:id/restore', contentController.restoreVersion);

export default router;
