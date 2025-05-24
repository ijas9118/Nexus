// types/review.ts
export interface Review {
  _id: string;
  rating: number; // 1 to 5, for example
  feedback?: string;
  mentorId: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PaginatedReviewResponse {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MentorStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number }; // e.g., { "1": 2, "2": 0, "3": 5, ... }
}

export interface CreateReviewData {
  rating: number;
  feedback?: string;
  mentorId: string;
}

export interface UpdateReviewData {
  rating?: number;
  feedback?: string;
}
