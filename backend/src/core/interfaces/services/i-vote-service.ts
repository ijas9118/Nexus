import type { IVote } from "@/models/social/vote.model";

export interface IVoteService {
  vote: (contentId: string, userId: string, voteType: "upvote" | "downvote") => Promise<void>;
  getVotes: (contentId: string) => Promise<{ upvotes: number; downvotes: number }>;
  getUserVotes: (userId: string) => Promise<IVote[]>;
}
