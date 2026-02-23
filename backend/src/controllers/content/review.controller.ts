import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IReviewController } from "@/core/interfaces/controllers/i-review-controller";
import type { IReviewService } from "@/core/interfaces/services/i-review-service";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { REVIEW_MESSAGES } = MESSAGES;

@injectable()
export class ReviewController implements IReviewController {
  constructor(@inject(TYPES.ReviewService) private _reviewService: IReviewService) {}

  createReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { rating, feedback, mentorId } = req.body;
    const userId = req.user?._id as string; // Assuming user is attached to request via auth middleware

    if (!userId) {
      throw new CustomError(REVIEW_MESSAGES.AUTH_REQUIRED, StatusCodes.UNAUTHORIZED);
    }

    if (!rating || !mentorId) {
      throw new CustomError(REVIEW_MESSAGES.RATING_MENTOR_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const review = await this._reviewService.createReview({
      rating,
      feedback,
      mentorId,
      userId,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: REVIEW_MESSAGES.CREATED,
      data: review,
    });
  });

  getReviewById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const review = await this._reviewService.getReviewById(id as string);

    if (!review) {
      throw new CustomError(REVIEW_MESSAGES.NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: review,
    });
  });

  getAllReviews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = Number.parseInt(req.query.page as string) || 1;
    const limit = Number.parseInt(req.query.limit as string) || 10;

    const result = await this._reviewService.getAllReviews(page, limit);

    res.status(StatusCodes.OK).json({
      success: true,
      data: result,
    });
  });

  getReviewsByMentor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mentorId } = req.params;
    const page = Number.parseInt(req.query.page as string) || 1;
    const limit = Number.parseInt(req.query.limit as string) || 10;

    const result = await this._reviewService.getReviewsByMentor(mentorId as string, page, limit);

    res.status(StatusCodes.OK).json({
      success: true,
      data: result,
    });
  });

  getMyReviews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;

    if (!userId) {
      throw new CustomError(REVIEW_MESSAGES.AUTH_REQUIRED, StatusCodes.UNAUTHORIZED);
    }

    const reviews = await this._reviewService.getReviewsByUser(userId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: reviews,
    });
  });

  updateReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { rating, feedback } = req.body;
    const userId = req.user?._id as string;

    if (!userId) {
      throw new CustomError(REVIEW_MESSAGES.AUTH_REQUIRED, StatusCodes.UNAUTHORIZED);
    }

    const review = await this._reviewService.updateReview(
      id as string,
      { rating, feedback },
      userId,
    );

    if (!review) {
      throw new CustomError(REVIEW_MESSAGES.NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: REVIEW_MESSAGES.UPDATED,
      data: review,
    });
  });

  deleteReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?._id as string;

    if (!userId) {
      throw new CustomError(REVIEW_MESSAGES.AUTH_REQUIRED, StatusCodes.UNAUTHORIZED);
    }

    const success = await this._reviewService.deleteReview(id as string, userId);

    if (!success) {
      throw new CustomError(REVIEW_MESSAGES.NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: REVIEW_MESSAGES.DELETED,
    });
  });

  getMentorStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mentorId } = req.params;
    const stats = await this._reviewService.getMentorStats(mentorId as string);

    res.status(StatusCodes.OK).json({
      success: true,
      data: stats,
    });
  });

  checkExistingReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mentorId } = req.params;
    const userId = req.user?._id as string;

    if (!userId) {
      throw new CustomError(REVIEW_MESSAGES.AUTH_REQUIRED, StatusCodes.UNAUTHORIZED);
    }

    const existingReview = await this._reviewService.checkExistingReview(
      mentorId as string,
      userId,
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        hasReviewed: !!existingReview,
        review: existingReview,
      },
    });
  });
}
