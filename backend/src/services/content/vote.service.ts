import { inject, injectable } from "inversify";

import type { IContentRepository } from "@/core/interfaces/repositories/i-content-repository";
import type { IVoteRepository } from "@/core/interfaces/repositories/i-vote-repository";
import type { IVoteService } from "@/core/interfaces/services/i-vote-service";
import type { IVote } from "@/models/social/vote.model";

import { TYPES } from "@/di/types";

@injectable()
export class VoteService implements IVoteService {
  constructor(
    @inject(TYPES.VoteRepository) private _voteRepository: IVoteRepository,
    @inject(TYPES.ContentRepository) private _contentRepository: IContentRepository,
  ) {}

  async vote(contentId: string, userId: string, voteType: "upvote" | "downvote"): Promise<void> {
    const existingVote = await this._voteRepository.findUserVote(contentId, userId);

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // If same vote clicked again, remove the vote (toggle off)
        await this._voteRepository.delete(existingVote._id as string);
        await this._contentRepository.updateOne(
          { _id: contentId },
          {
            $inc: {
              [`${voteType}Count`]: -1,
            },
          },
        );
      }
      else {
        // If different vote, update it
        await this._voteRepository.update(existingVote._id as string, { voteType });
        await this._contentRepository.updateOne(
          { _id: contentId },
          { $inc: { [`${existingVote.voteType}Count`]: -1, [`${voteType}Count`]: 1 } },
        );
      }
    }
    else {
      // If no vote yet, create a new vote
      await this._voteRepository.create({ contentId, userId, voteType });
      await this._contentRepository.updateOne(
        { _id: contentId },
        { $inc: { [`${voteType}Count`]: 1 } },
      );
    }
  }

  async getVotes(contentId: string): Promise<{ upvotes: number; downvotes: number }> {
    return this._voteRepository.countVotes(contentId);
  }

  async getUserVotes(userId: string): Promise<IVote[]> {
    return this._voteRepository.findUserVotes(userId);
  }
}
