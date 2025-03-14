import { Router } from 'express';
import { IAdminController } from '@/core/interfaces/controllers/admin/IAdminController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { authenticate } from '@/middlewares/auth.middleware';

const adminController = container.get<IAdminController>(TYPES.AdminController);

const router = Router();

router.get('/', authenticate(['admin']), (req, res) => adminController.getUsers(req, res));

export default router;
