import { injectable } from "inversify";

import type { IVoteRepository } from "@/core/interfaces/repositories/i-vote-repository";
import type { IVote } from "@/models/social/vote.model";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { VoteModel } from "@/models/social/vote.model";

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
      this._model.countDocuments({ contentId, voteType: "upvote" }),
      this._model.countDocuments({ contentId, voteType: "downvote" }),
    ]);
    return { upvotes, downvotes };
  }

  async findUserVotes(userId: string): Promise<IVote[]> {
    return this.find({ userId });
  }
}
