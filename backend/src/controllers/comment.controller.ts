import asyncHandler from "express-async-handler";
import { ICommentController } from "../core/interfaces/controllers/ICommentController";
import { CustomRequest } from "../core/types/CustomRequest";
import { Request, Response } from "express";
import CustomError from "../utils/CustomError";
import { StatusCodes } from "http-status-codes";
import { ICommentService } from "../core/interfaces/services/ICommentService";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";

@injectable()
export class CommentController implements ICommentController {
  constructor(@inject(TYPES.CommentService) private commentService: ICommentService) {}

  addComment = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const { contentId, text, parentCommentId } = req.body;
    const userId = req.user?._id as string;

    if (!contentId || !text)
      throw new CustomError("Content ID and text are required", StatusCodes.BAD_REQUEST);

    const comment = await this.commentService.addComment({
      userId,
      contentId,
      text,
      parentCommentId,
    });

    res.status(StatusCodes.OK).json(comment);
  });

  getCommentsByContentId = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { contentId } = req.query;
      console.log(req.query);

      if (!contentId) {
        throw new CustomError("Content ID is required", StatusCodes.BAD_REQUEST);
      }

      const comments = await this.commentService.getCommentsByContentId(
        contentId as string
      );
      res.status(StatusCodes.OK).json(comments);
    }
  );
}
