import {
  Review,
  PaginatedReviewResponse,
  MentorStats,
  CreateReviewData,
  UpdateReviewData,
} from "@/types/review";
import api from "./api";

const ReviewService = {
  // Create a new review (POST /review)
  createReview: (data: CreateReviewData) =>
    api.post<Review>("/review", data).then((res) => res.data),

  // Get a review by ID (GET /review/:id)
  getReviewById: (id: string) =>
    api.get<Review>(`/review/${id}`).then((res) => res.data),

  // Get all reviews with pagination (GET /review)
  getAllReviews: (page: number = 1, limit: number = 10) =>
    api
      .get<PaginatedReviewResponse>("/review", {
        params: { page, limit },
      })
      .then((res) => res.data),

  // Get reviews for a specific mentor with pagination (GET /review/mentor/:mentorId)
  getReviewsByMentor: (
    mentorId: string,
    page: number = 1,
    limit: number = 10,
  ) =>
    api
      .get<PaginatedReviewResponse>(`/review/mentor/${mentorId}`, {
        params: { page, limit },
      })
      .then((res) => res.data),

  // Get reviews by the authenticated user (GET /review/user/my-reviews)
  getMyReviews: () =>
    api.get<Review[]>("/review/user/my-reviews").then((res) => res.data),

  // Update a review (PUT /review/:id)
  updateReview: (id: string, data: UpdateReviewData) =>
    api.put<Review>(`/review/${id}`, data).then((res) => res.data),

  // Delete a review (DELETE /review/:id)
  deleteReview: (id: string) =>
    api
      .delete<{ success: boolean; message: string }>(`/review/${id}`)
      .then((res) => res.data),

  // Get mentor review stats (GET /review/mentor/:mentorId/stats)
  getMentorStats: (mentorId: string) =>
    api
      .get<MentorStats>(`/review/mentor/${mentorId}/stats`)
      .then((res) => res.data),

  // Check if the user has already reviewed a mentor (GET /review/check/:mentorId)
  checkExistingReview: (mentorId: string) =>
    api
      .get<{
        hasReviewed: boolean;
        review: Review | null;
      }>(`/review/check/${mentorId}`)
      .then((res) => res.data),
};

export default ReviewService;
