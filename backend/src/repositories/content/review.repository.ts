import { injectable } from "inversify";
import { Types } from "mongoose";

import type { IReviewRepository } from "@/core/interfaces/repositories/i-review-repository";
import type { IReview } from "@/models/social/review.model";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { Review } from "@/models/social/review.model";

@injectable()
export class ReviewRepository extends BaseRepository<IReview> implements IReviewRepository {
  constructor() {
    super(Review);
  }

  async findByMentorId(mentorId: Types.ObjectId | string): Promise<IReview[]> {
    return this.model
      .find({ mentorId, isActive: true })
      .populate("userId", "name email avatar")
      .sort({ createdAt: -1 });
  }

  async findByUserId(userId: Types.ObjectId | string): Promise<IReview[]> {
    return this.model
      .find({ userId, isActive: true })
      .populate("mentorId", "name email avatar")
      .sort({ createdAt: -1 });
  }

  async findByMentorAndUser(
    mentorId: Types.ObjectId | string,
    userId: Types.ObjectId | string,
  ): Promise<IReview | null> {
    return this.model.findOne({ mentorId, userId, isActive: true });
  }

  async getAverageRatingByMentor(mentorId: Types.ObjectId | string): Promise<number> {
    const result = await this.model.aggregate([
      { $match: { mentorId: new Types.ObjectId(mentorId), isActive: true } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } },
    ]);

    return result.length > 0 ? Math.round(result[0].averageRating * 10) / 10 : 0;
  }

  async getMentorReviewStats(mentorId: Types.ObjectId | string): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: string]: number };
  }> {
    const [avgResult, countResult, distributionResult] = await Promise.all([
      this.model.aggregate([
        { $match: { mentorId: new Types.ObjectId(mentorId), isActive: true } },
        { $group: { _id: null, averageRating: { $avg: "$rating" } } },
      ]),
      this.model.countDocuments({ mentorId, isActive: true }),
      this.model.aggregate([
        { $match: { mentorId: new Types.ObjectId(mentorId), isActive: true } },
        { $group: { _id: "$rating", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const averageRating
      = avgResult.length > 0 ? Math.round(avgResult[0].averageRating * 10) / 10 : 0;
    const totalReviews = countResult;
    const ratingDistribution: { [key: string]: number } = {};

    // Initialize all possible ratings
    [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].forEach((rating) => {
      ratingDistribution[rating.toString()] = 0;
    });

    // Fill in actual distribution
    distributionResult.forEach((item) => {
      ratingDistribution[item._id.toString()] = item.count;
    });

    return { averageRating, totalReviews, ratingDistribution };
  }

  async findActiveReviews(): Promise<IReview[]> {
    return this.model
      .find({ isActive: true })
      .populate("userId", "name email avatar")
      .populate("mentorId", "name email avatar")
      .sort({ createdAt: -1 });
  }

  async findReviewsWithPagination(
    page: number,
    limit: number,
    mentorId?: Types.ObjectId | string,
  ): Promise<{
    reviews: IReview[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const skip = (page - 1) * limit;
    const filter: any = { isActive: true };

    if (mentorId) {
      filter.mentorId = mentorId;
    }

    const [reviews, total] = await Promise.all([
      this.model
        .find(filter)
        .populate("userId", "name email avatar")
        .populate("mentorId", "name email avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this.model.countDocuments(filter),
    ]);

    return {
      reviews,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }
}
