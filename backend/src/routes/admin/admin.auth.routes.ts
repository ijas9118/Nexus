import { Router } from 'express';
import { container } from '../../di/container';
import { AdminAuthController } from '../../controllers/admin/admin.auth.controller';
import { TYPES } from '../../di/types';

const adminAuthController = container.get<AdminAuthController>(TYPES.AdminAuthController);

const router = Router();

router.post('/login', (req, res) => adminAuthController.login(req, res));

router.get('/logout', (req, res) => adminAuthController.logout(req, res));

export default router;
