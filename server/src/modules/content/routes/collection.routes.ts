import { Router } from 'express';
import { collectionController } from '../controllers/collection.controller';
import { authenticate } from '../../auth/middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', collectionController.create);
router.get('/', collectionController.list);
router.get('/:id', collectionController.getById);
router.put('/:id', collectionController.update);
router.delete('/:id', collectionController.delete);

export default router;
