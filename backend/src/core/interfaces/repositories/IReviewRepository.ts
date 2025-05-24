import { IReview } from '@/models/review.model';
import { Types } from 'mongoose';
import { IBaseRepository } from './IBaseRepository';

export interface IReviewRepository extends IBaseRepository<IReview> {
  findByMentorId(mentorId: Types.ObjectId | string): Promise<IReview[]>;
  findByUserId(userId: Types.ObjectId | string): Promise<IReview[]>;
  findByMentorAndUser(
    mentorId: Types.ObjectId | string,
    userId: Types.ObjectId | string
  ): Promise<IReview | null>;
  getAverageRatingByMentor(mentorId: Types.ObjectId | string): Promise<number>;
  getMentorReviewStats(mentorId: Types.ObjectId | string): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: string]: number };
  }>;
  findActiveReviews(): Promise<IReview[]>;
  findReviewsWithPagination(
    page: number,
    limit: number,
    mentorId?: Types.ObjectId | string
  ): Promise<{
    reviews: IReview[];
    total: number;
    totalPages: number;
    currentPage: number;
  }>;
}
