import { RequestHandler } from 'express';

export interface IVoteController {
  getUserVotes: RequestHandler;
  voteContent: RequestHandler;
}
