import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import type { IReviewRepository } from "@/core/interfaces/repositories/i-review-repository";
import type { IReviewService } from "@/core/interfaces/services/i-review-service";
import type { CreateReviewDTO, UpdateReviewDTO } from "@/dtos/responses/review.dto";
import type { IReview } from "@/models/social/review.model";

import { TYPES } from "@/di/types";

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
      throw new Error("You have already reviewed this mentor");
    }

    // Validate rating
    if (data.rating < 0.5 || data.rating > 5 || (data.rating * 2) % 1 !== 0) {
      throw new Error("Rating must be between 0.5 and 5 in increments of 0.5");
    }

    // Prevent self-review
    if (data.mentorId === data.userId) {
      throw new Error("You cannot review yourself");
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
      throw new Error("Invalid review ID");
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
      throw new Error("Invalid pagination parameters");
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
      throw new Error("Invalid mentor ID");
    }

    if (page < 1 || limit < 1 || limit > 100) {
      throw new Error("Invalid pagination parameters");
    }

    return this.reviewRepository.findReviewsWithPagination(page, limit, mentorId);
  }

  async getReviewsByUser(userId: string): Promise<IReview[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    return this.reviewRepository.findByUserId(userId);
  }

  async updateReview(id: string, data: UpdateReviewDTO, userId: string): Promise<IReview | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid review ID");
    }

    const existingReview = await this.reviewRepository.findById(id);
    if (!existingReview || !existingReview.isActive) {
      throw new Error("Review not found");
    }

    // Check if user owns this review
    if (existingReview.userId.toString() !== userId) {
      throw new Error("You can only update your own reviews");
    }

    // Validate rating if provided
    if (data.rating !== undefined) {
      if (data.rating < 0.5 || data.rating > 5 || (data.rating * 2) % 1 !== 0) {
        throw new Error("Rating must be between 0.5 and 5 in increments of 0.5");
      }
    }

    return this.reviewRepository.update(id, data);
  }

  async deleteReview(id: string, userId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid review ID");
    }

    const existingReview = await this.reviewRepository.findById(id);
    if (!existingReview || !existingReview.isActive) {
      throw new Error("Review not found");
    }

    // Check if user owns this review
    if (existingReview.userId.toString() !== userId) {
      throw new Error("You can only delete your own reviews");
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
      throw new Error("Invalid mentor ID");
    }

    return this.reviewRepository.getMentorReviewStats(mentorId);
  }

  async checkExistingReview(mentorId: string, userId: string): Promise<IReview | null> {
    if (!Types.ObjectId.isValid(mentorId) || !Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid mentor or user ID");
    }

    return this.reviewRepository.findByMentorAndUser(mentorId, userId);
  }
}
