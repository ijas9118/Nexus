import { UserController } from '@/controllers/user.controller';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { authenticate } from '@/middlewares/auth.middleware';
import upload from '@/middlewares/multer';
import { Router } from 'express';

const userController = container.get<UserController>(TYPES.UserController);
const router = Router();

router.get('/squads', authenticate(['user', 'premium']), userController.getUserJoinedSquads);

router.post('/update', authenticate(['user', 'premium']), userController.updateUser);

router.post('/update/password', authenticate(['user', 'premium']), userController.updatePassword);

router.put(
  '/update/profile-pic',
  authenticate(['user', 'premium']),
  upload.single('profilePic'),
  userController.updateProfilePic
);

router.post('/:username', userController.getUserData);

export default router;
