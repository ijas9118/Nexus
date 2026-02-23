import api from "./api";
import { handleApi } from "@/utils/handleApi";
import { CONTENT_ROUTES } from "@/utils/constants";

// Define types for the response from the API
export interface IVoteResponse {
  success: boolean;
  votes: {
    upvoteCount: number;
    downvoteCount: number;
    // Add other vote-related fields here
  };
}

export interface IUserVotesResponse {
  success: boolean;
  votes: {
    contentId: string;
    voteType: "upvote" | "downvote";
    // Add other vote-related fields here
  }[];
}

const VoteService = {
  voteContent: (contentId: string, voteType: "upvote" | "downvote") =>
    handleApi<IVoteResponse>(() =>
      api.post(`${CONTENT_ROUTES.POST}/vote`, { contentId, voteType }),
    ),

  getUserVotes: () =>
    handleApi(() => api.get(`${CONTENT_ROUTES.POST}/user-votes`)),
};

export default VoteService;
