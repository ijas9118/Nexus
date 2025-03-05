import { Router } from 'express';
import { AdminController } from '../../controllers/admin/admin.controller';
import { container } from '../../di/container';
import { TYPES } from '../../di/types';
import { authenticate } from '../../middlewares/auth.middleware';

const adminController = container.get<AdminController>(TYPES.AdminController);

const router = Router();

router.get('/', authenticate(['admin']), (req, res) => adminController.getUsers(req, res));

export default router;
