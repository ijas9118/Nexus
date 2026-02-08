import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IVoteController } from "@/core/interfaces/controllers/i-vote-controller";

import type { IVoteService } from "../core/interfaces/services/i-vote-service";

import { TYPES } from "../di/types";

@injectable()
export class VoteController implements IVoteController {
  constructor(@inject(TYPES.VoteService) private voteService: IVoteService) {}

  // Vote on content
  voteContent = asyncHandler(async (req: Request, res: Response) => {
    const { contentId, voteType } = req.body;
    const userId = req.user?._id as string;

    // Process the vote
    await this.voteService.vote(contentId, userId, voteType);

    // Get updated vote counts
    const votes = await this.voteService.getVotes(contentId);

    res.status(StatusCodes.OK).json({
      success: true,
      votes,
    });
  });

  // Get votes by user
  getUserVotes = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string;

    // Fetch user votes
    const userVotes = await this.voteService.getUserVotes(userId);

    res.status(StatusCodes.OK).json({
      success: true,
      votes: userVotes,
    });
  });
}
