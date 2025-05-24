export interface CreateReviewDTO {
  rating: number;
  feedback?: string;
  mentorId: string;
  userId: string;
}

export interface UpdateReviewDTO {
  rating?: number;
  feedback?: string;
}
