import { IReviewController } from '@/core/interfaces/controllers/IReviewController';
import { IReviewService } from '@/core/interfaces/services/IReviewService';
import { TYPES } from '@/di/types';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { injectable, inject } from 'inversify';

@injectable()
export class ReviewController implements IReviewController {
  constructor(@inject(TYPES.ReviewService) private reviewService: IReviewService) {}

  createReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { rating, feedback, mentorId } = req.body;
    const userId = req.user?._id as string; // Assuming user is attached to request via auth middleware

    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!rating || !mentorId) {
      res.status(400).json({ error: 'Rating and mentorId are required' });
      return;
    }

    const review = await this.reviewService.createReview({
      rating,
      feedback,
      mentorId,
      userId,
    });

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review,
    });
  });

  getReviewById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const review = await this.reviewService.getReviewById(id);

    if (!review) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }

    res.json({
      success: true,
      data: review,
    });
  });

  getAllReviews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await this.reviewService.getAllReviews(page, limit);

    res.json({
      success: true,
      data: result,
    });
  });

  getReviewsByMentor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mentorId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await this.reviewService.getReviewsByMentor(mentorId, page, limit);

    res.json({
      success: true,
      data: result,
    });
  });

  getMyReviews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;

    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const reviews = await this.reviewService.getReviewsByUser(userId);

    res.json({
      success: true,
      data: reviews,
    });
  });

  updateReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { rating, feedback } = req.body;
    const userId = req.user?._id as string;

    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const review = await this.reviewService.updateReview(id, { rating, feedback }, userId);

    if (!review) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review,
    });
  });

  deleteReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?._id as string;

    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const success = await this.reviewService.deleteReview(id, userId);

    if (!success) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  });

  getMentorStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mentorId } = req.params;
    const stats = await this.reviewService.getMentorStats(mentorId);

    res.json({
      success: true,
      data: stats,
    });
  });

  checkExistingReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mentorId } = req.params;
    const userId = req.user?._id as string;

    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const existingReview = await this.reviewService.checkExistingReview(mentorId, userId);

    res.json({
      success: true,
      data: {
        hasReviewed: !!existingReview,
        review: existingReview,
      },
    });
  });
}
