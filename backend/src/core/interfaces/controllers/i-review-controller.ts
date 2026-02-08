import type { RequestHandler } from 'express';

export interface IReviewController {
  checkExistingReview: RequestHandler;
  getMentorStats: RequestHandler;
  deleteReview: RequestHandler;
  updateReview: RequestHandler;
  getMyReviews: RequestHandler;
  getReviewsByMentor: RequestHandler;
  getAllReviews: RequestHandler;
  getReviewById: RequestHandler;
  createReview: RequestHandler;
}
