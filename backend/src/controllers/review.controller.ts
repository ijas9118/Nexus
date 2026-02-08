import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import type { IReviewController } from "@/core/interfaces/controllers/i-review-controller";
import type { IReviewService } from "@/core/interfaces/services/i-review-service";

import { TYPES } from "@/di/types";

@injectable()
export class ReviewController implements IReviewController {
  constructor(@inject(TYPES.ReviewService) private _reviewService: IReviewService) {}

  createReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { rating, feedback, mentorId } = req.body;
    const userId = req.user?._id as string; // Assuming user is attached to request via auth middleware

    if (!userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    if (!rating || !mentorId) {
      res.status(400).json({ error: "Rating and mentorId are required" });
      return;
    }

    const review = await this._reviewService.createReview({
      rating,
      feedback,
      mentorId,
      userId,
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  });

  getReviewById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const review = await this._reviewService.getReviewById(id as string);

    if (!review) {
      res.status(404).json({ error: "Review not found" });
      return;
    }

    res.json({
      success: true,
      data: review,
    });
  });

  getAllReviews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = Number.parseInt(req.query.page as string) || 1;
    const limit = Number.parseInt(req.query.limit as string) || 10;

    const result = await this._reviewService.getAllReviews(page, limit);

    res.json({
      success: true,
      data: result,
    });
  });

  getReviewsByMentor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mentorId } = req.params;
    const page = Number.parseInt(req.query.page as string) || 1;
    const limit = Number.parseInt(req.query.limit as string) || 10;

    const result = await this._reviewService.getReviewsByMentor(mentorId as string, page, limit);

    res.json({
      success: true,
      data: result,
    });
  });

  getMyReviews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;

    if (!userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const reviews = await this._reviewService.getReviewsByUser(userId);

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
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const review = await this._reviewService.updateReview(
      id as string,
      { rating, feedback },
      userId,
    );

    if (!review) {
      res.status(404).json({ error: "Review not found" });
      return;
    }

    res.json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  });

  deleteReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?._id as string;

    if (!userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const success = await this._reviewService.deleteReview(id as string, userId);

    if (!success) {
      res.status(404).json({ error: "Review not found" });
      return;
    }

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  });

  getMentorStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mentorId } = req.params;
    const stats = await this._reviewService.getMentorStats(mentorId as string);

    res.json({
      success: true,
      data: stats,
    });
  });

  checkExistingReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mentorId } = req.params;
    const userId = req.user?._id as string;

    if (!userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const existingReview = await this._reviewService.checkExistingReview(
      mentorId as string,
      userId,
    );

    res.json({
      success: true,
      data: {
        hasReviewed: !!existingReview,
        review: existingReview,
      },
    });
  });
}
