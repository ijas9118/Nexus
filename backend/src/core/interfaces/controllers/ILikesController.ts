import { RequestHandler } from 'express';

export interface ILikesController {
  toggleLike: RequestHandler;
}
