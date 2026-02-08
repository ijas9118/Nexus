import { inject, injectable } from 'inversify';

import type { IContentRepository } from '@/core/interfaces/repositories/i-content-repository';
import type { IVoteRepository } from '@/core/interfaces/repositories/i-vote-repository';
import type { IVoteService } from '@/core/interfaces/services/i-vote-service';
import type { IVote } from '@/models/vote.model';

import { TYPES } from '@/di/types';

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
      } else {
        // If different vote, update it
        await this.voteRepository.update(existingVote._id as string, { voteType });
        await this.contentRepository.updateOne(
          { _id: contentId },
          { $inc: { [`${existingVote.voteType}Count`]: -1, [`${voteType}Count`]: 1 } }
        );
      }
    } else {
      // If no vote yet, create a new vote
      await this.voteRepository.create({ contentId, userId, voteType });
      await this.contentRepository.updateOne(
        { _id: contentId },
        { $inc: { [`${voteType}Count`]: 1 } }
      );
    }
  }

  async getVotes(contentId: string): Promise<{ upvotes: number; downvotes: number }> {
    return this.voteRepository.countVotes(contentId);
  }

  async getUserVotes(userId: string): Promise<IVote[]> {
    return this.voteRepository.findUserVotes(userId);
  }
}
