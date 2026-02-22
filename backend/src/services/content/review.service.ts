import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import type { IReviewRepository } from "@/core/interfaces/repositories/i-review-repository";
import type { IReviewService } from "@/core/interfaces/services/i-review-service";
import type { CreateReviewDTO, UpdateReviewDTO } from "@/dtos/responses/review.dto";
import type { IReview } from "@/models/social/review.model";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { REVIEW_MESSAGES } = MESSAGES;

@injectable()
export class ReviewService implements IReviewService {
  constructor(@inject(TYPES.ReviewRepository) private reviewRepository: IReviewRepository) {}

  async createReview(data: CreateReviewDTO): Promise<IReview> {
    // Check if user already reviewed this mentor
    const existingReview = await this.reviewRepository.findByMentorAndUser(
      data.mentorId,
      data.userId,
    );

    if (existingReview) {
      throw new CustomError(REVIEW_MESSAGES.ALREADY_REVIEWED, StatusCodes.CONFLICT);
    }

    // Validate rating
    if (data.rating < 0.5 || data.rating > 5 || (data.rating * 2) % 1 !== 0) {
      throw new CustomError(REVIEW_MESSAGES.INVALID_RATING, StatusCodes.BAD_REQUEST);
    }

    // Prevent self-review
    if (data.mentorId === data.userId) {
      throw new CustomError(REVIEW_MESSAGES.SELF_REVIEW, StatusCodes.BAD_REQUEST);
    }

    const reviewData = {
      ...data,
      mentorId: new Types.ObjectId(data.mentorId),
      userId: new Types.ObjectId(data.userId),
    };

    return this.reviewRepository.create(reviewData);
  }

  async getReviewById(id: string): Promise<IReview | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new CustomError(REVIEW_MESSAGES.INVALID_ID, StatusCodes.BAD_REQUEST);
    }

    const review = await this.reviewRepository.findById(id);
    if (!review || !review.isActive) {
      return null;
    }

    return review;
  }

  async getAllReviews(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    reviews: IReview[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    if (page < 1 || limit < 1 || limit > 100) {
      throw new CustomError(REVIEW_MESSAGES.INVALID_PAGINATION, StatusCodes.BAD_REQUEST);
    }

    return this.reviewRepository.findReviewsWithPagination(page, limit);
  }

  async getReviewsByMentor(
    mentorId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    reviews: IReview[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    if (!Types.ObjectId.isValid(mentorId)) {
      throw new CustomError(REVIEW_MESSAGES.INVALID_MENTOR_ID, StatusCodes.BAD_REQUEST);
    }

    if (page < 1 || limit < 1 || limit > 100) {
      throw new CustomError(REVIEW_MESSAGES.INVALID_PAGINATION, StatusCodes.BAD_REQUEST);
    }

    return this.reviewRepository.findReviewsWithPagination(page, limit, mentorId);
  }

  async getReviewsByUser(userId: string): Promise<IReview[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError(MESSAGES.USER_MESSAGES.USER_ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    return this.reviewRepository.findByUserId(userId);
  }

  async updateReview(id: string, data: UpdateReviewDTO, userId: string): Promise<IReview | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new CustomError(REVIEW_MESSAGES.INVALID_ID, StatusCodes.BAD_REQUEST);
    }

    const existingReview = await this.reviewRepository.findById(id);
    if (!existingReview || !existingReview.isActive) {
      throw new CustomError(REVIEW_MESSAGES.NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    // Check if user owns this review
    if (existingReview.userId.toString() !== userId) {
      throw new CustomError(REVIEW_MESSAGES.UPDATE_OWN_ONLY, StatusCodes.FORBIDDEN);
    }

    // Validate rating if provided
    if (data.rating !== undefined) {
      if (data.rating < 0.5 || data.rating > 5 || (data.rating * 2) % 1 !== 0) {
        throw new CustomError(REVIEW_MESSAGES.INVALID_RATING, StatusCodes.BAD_REQUEST);
      }
    }

    return this.reviewRepository.update(id, data);
  }

  async deleteReview(id: string, userId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      throw new CustomError(REVIEW_MESSAGES.INVALID_ID, StatusCodes.BAD_REQUEST);
    }

    const existingReview = await this.reviewRepository.findById(id);
    if (!existingReview || !existingReview.isActive) {
      throw new CustomError(REVIEW_MESSAGES.NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    // Check if user owns this review
    if (existingReview.userId.toString() !== userId) {
      throw new CustomError(REVIEW_MESSAGES.DELETE_OWN_ONLY, StatusCodes.FORBIDDEN);
    }

    const result = await this.reviewRepository.softDelete(id);
    return result !== null;
  }

  async getMentorStats(mentorId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: string]: number };
  }> {
    if (!Types.ObjectId.isValid(mentorId)) {
      throw new CustomError(REVIEW_MESSAGES.INVALID_MENTOR_ID, StatusCodes.BAD_REQUEST);
    }

    return this.reviewRepository.getMentorReviewStats(mentorId);
  }

  async checkExistingReview(mentorId: string, userId: string): Promise<IReview | null> {
    if (!Types.ObjectId.isValid(mentorId) || !Types.ObjectId.isValid(userId)) {
      throw new CustomError(REVIEW_MESSAGES.INVALID_MENTOR_USER_ID, StatusCodes.BAD_REQUEST);
    }

    return this.reviewRepository.findByMentorAndUser(mentorId, userId);
  }
}
