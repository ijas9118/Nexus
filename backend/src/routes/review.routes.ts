import { IReviewController } from '@/core/interfaces/controllers/IReviewController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { authenticate } from '@/middlewares/auth.middleware';
import { Router } from 'express';

const router = Router();
const reviewController = container.get<IReviewController>(TYPES.ReviewController);

// Public routes
router.get('/mentor/:mentorId', reviewController.getReviewsByMentor);
router.get('/mentor/:mentorId/stats', reviewController.getMentorStats);
router.get('/:id', reviewController.getReviewById);
router.get('/', reviewController.getAllReviews);

router.use(authenticate(['admin', 'mentor', 'premium', 'user']));

router.post('/', reviewController.createReview);
router.get('/user/my-reviews', reviewController.getMyReviews);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);
router.get('/check/:mentorId', reviewController.checkExistingReview);

export { router as reviewRoutes };
