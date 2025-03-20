import { UserController } from '@/controllers/user.controller';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { authenticate } from '@/middlewares/auth.middleware';
import { Router } from 'express';

const userController = container.get<UserController>(TYPES.UserController);
const router = Router();

router.get('/squads', authenticate(['user', 'premium']), userController.getUserJoinedSquads);

router.post('/update', authenticate(['user', 'premium']), userController.updateUser);

router.post('/update/password', authenticate(['user', 'premium']), userController.updatePassword);

router.post('/:username', userController.getUserData);

export default router;
