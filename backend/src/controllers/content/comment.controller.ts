import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { ICommentController } from "@/core/interfaces/controllers/i-comment-controller";
import type { ICommentService } from "@/core/interfaces/services/i-comment-service";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { CONTENT_MESSAGES } = MESSAGES;

@injectable()
export class CommentController implements ICommentController {
  constructor(@inject(TYPES.CommentService) private _commentService: ICommentService) {}

  addComment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { contentId, text, parentCommentId } = req.body;
    const userId = req.user?._id as string;

    if (!contentId || !text) {
      throw new CustomError(CONTENT_MESSAGES.ID_TEXT_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const comment = await this._commentService.addComment({
      userId,
      contentId,
      text,
      parentCommentId,
    });

    res.status(StatusCodes.OK).json(comment);
  });

  getCommentsByContentId = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { contentId } = req.query;

    if (!contentId) {
      throw new CustomError(CONTENT_MESSAGES.ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const comments = await this._commentService.getCommentsByContentId(contentId as string);
    res.status(StatusCodes.OK).json(comments);
  });

  getAllComments = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const comments = await this._commentService.getAllComments();
    res.status(StatusCodes.OK).json(comments);
  });
}
