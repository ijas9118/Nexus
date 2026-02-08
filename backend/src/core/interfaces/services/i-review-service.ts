import type { CreateReviewDTO, UpdateReviewDTO } from '@/dtos/responses/review.dto';
import type { IReview } from '@/models/review.model';

export interface IReviewService {
  createReview: (data: CreateReviewDTO) => Promise<IReview>;
  getReviewById: (id: string) => Promise<IReview | null>;
  getAllReviews: (
    page?: number,
    limit?: number
  ) => Promise<{
    reviews: IReview[];
    total: number;
    totalPages: number;
    currentPage: number;
  }>;
  getReviewsByMentor: (
    mentorId: string,
    page?: number,
    limit?: number
  ) => Promise<{
    reviews: IReview[];
    total: number;
    totalPages: number;
    currentPage: number;
  }>;
  getReviewsByUser: (userId: string) => Promise<IReview[]>;
  updateReview: (id: string, data: UpdateReviewDTO, userId: string) => Promise<IReview | null>;
  deleteReview: (id: string, userId: string) => Promise<boolean>;
  getMentorStats: (mentorId: string) => Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: string]: number };
  }>;
  checkExistingReview: (mentorId: string, userId: string) => Promise<IReview | null>;
}
