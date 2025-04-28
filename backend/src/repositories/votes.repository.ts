import { BaseRepository } from '../core/abstracts/base.repository';
import { IVoteRepository } from '../core/interfaces/repositories/IVoteRepository';
import { IVote, VoteModel } from '../models/vote.model';
import { injectable } from 'inversify';

@injectable()
export class VoteRepository extends BaseRepository<IVote> implements IVoteRepository {
  constructor() {
    super(VoteModel);
  }

  async findUserVote(contentId: string, userId: string): Promise<IVote | null> {
    return this.findOne({ contentId, userId });
  }

  async countVotes(contentId: string): Promise<{ upvotes: number; downvotes: number }> {
    const [upvotes, downvotes] = await Promise.all([
      this.model.countDocuments({ contentId, voteType: 'upvote' }),
      this.model.countDocuments({ contentId, voteType: 'downvote' }),
    ]);
    return { upvotes, downvotes };
  }

  async findUserVotes(userId: string): Promise<IVote[]> {
    return this.find({ userId });
  }
}
