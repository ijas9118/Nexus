import { BaseRepository } from '@/core/abstracts/base.repository';
import { IVote } from '@/models/vote.model';

export interface IVoteRepository extends BaseRepository<IVote> {
  findUserVotes(userId: string): Promise<IVote[]>;
  countVotes(contentId: string): Promise<{ upvotes: number; downvotes: number }>;
  findUserVote(contentId: string, userId: string): Promise<IVote | null>;
}
