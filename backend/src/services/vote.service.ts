import { IContentRepository } from '@/core/interfaces/repositories/IContentRepository';
import { IVoteRepository } from '@/core/interfaces/repositories/IVoteRepository';
import { IVoteService } from '@/core/interfaces/services/IVoteService';
import { TYPES } from '@/di/types';
import { IVote } from '@/models/vote.model';
import { inject, injectable } from 'inversify';

@injectable()
export class VoteService implements IVoteService {
  constructor(
    @inject(TYPES.VoteRepository) private voteRepository: IVoteRepository,
    @inject(TYPES.ContentRepository) private contentRepository: IContentRepository
  ) {}

  async vote(contentId: string, userId: string, voteType: 'upvote' | 'downvote'): Promise<void> {
    const existingVote = await this.voteRepository.findUserVote(contentId, userId);

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // If same vote clicked again, remove the vote (toggle off)
        await this.voteRepository.delete(existingVote._id as string);
        await this.contentRepository.updateOne(
          { _id: contentId },
          {
            $inc: {
              [`${voteType}Count`]: -1,
            },
          }
        );

        return;
      } else {
        // If different vote, update it
        await this.voteRepository.update(existingVote._id as string, { voteType });
        await this.contentRepository.updateOne(
          { _id: contentId },
          { $inc: { [`${existingVote.voteType}Count`]: -1, [`${voteType}Count`]: 1 } }
        );
        return;
      }
    } else {
      // If no vote yet, create a new vote
      await this.voteRepository.create({ contentId, userId, voteType });
      await this.contentRepository.updateOne(
        { _id: contentId },
        { $inc: { [`${voteType}Count`]: 1 } }
      );
      return;
    }
  }

  async getVotes(contentId: string): Promise<{ upvotes: number; downvotes: number }> {
    return this.voteRepository.countVotes(contentId);
  }

  async getUserVotes(userId: string): Promise<IVote[]> {
    return this.voteRepository.findUserVotes(userId);
  }
}
