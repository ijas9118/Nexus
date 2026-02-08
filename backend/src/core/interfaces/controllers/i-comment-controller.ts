import type { RequestHandler } from "express";

export interface ICommentController {
  addComment: RequestHandler;
  getCommentsByContentId: RequestHandler;
  getAllComments: RequestHandler;
}
