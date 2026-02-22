import type { Express, Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IContentController } from "@/core/interfaces/controllers/i-content-controller";
import type { IContentService } from "@/core/interfaces/services/i-content-service";
import type { IHistoryService } from "@/core/interfaces/services/i-history-service";
import type { UserRole } from "@/core/types/user-types";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { CONTENT_MESSAGES, BOOKMARK_MESSAGES } = MESSAGES;

@injectable()
export class ContentController implements IContentController {
  constructor(
    @inject(TYPES.ContentService) private _contentService: IContentService,
    @inject(TYPES.HistoryService) private _historyService: IHistoryService,
  ) {}

  createContent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const thumbnailFile = files?.thumbnail?.[0];
    const videoFile = files?.videoFile?.[0];

    const contentData = {
      ...req.body,
      author: req.user?._id,
      userName: req.user?.name,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    const content = await this._contentService.createContent(contentData, thumbnailFile, videoFile);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: CONTENT_MESSAGES.CREATED,
      contentId: content._id,
    });
  });

  getContent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const role = req.user?.role as string;
    const userId = req.user?._id as string;

    const content = await this._contentService.getContentById(
      req.params.id as string,
      role as UserRole,
      userId,
    );

    if (!content) {
      throw new CustomError(CONTENT_MESSAGES.NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    if (role === "user") {
      await this._historyService.addHistory(req.user?._id as string, content._id as string);
    }

    res.status(StatusCodes.OK).json(content);
  });

  getAllContent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new CustomError(BOOKMARK_MESSAGES.AUTH_REQUIRED, StatusCodes.UNAUTHORIZED);
    }

    const { page = 1, limit = 10 } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);

    const contents = await this._contentService.getAllContent(req.user._id, pageNum, limitNum);

    // Calculate if there's a next page
    const totalContents = await this._contentService.getContentCount();
    const nextPage = pageNum * limitNum < totalContents ? pageNum + 1 : null;

    res.status(StatusCodes.OK).json({
      contents,
      nextPage,
    });
  });

  getPosts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const contents = await this._contentService.getPosts();
    res.status(StatusCodes.OK).json(contents);
  });

  verifyContent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { contentId } = req.params;

    const updatedContent = await this._contentService.verifyContent(contentId as string);
    if (!updatedContent) {
      throw new CustomError(CONTENT_MESSAGES.NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    res
      .status(StatusCodes.OK)
      .json({ message: CONTENT_MESSAGES.VERIFIED, content: updatedContent });
  });

  getFollowingUsersContents = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string;

    const contents = await this._contentService.getFollowingUsersContents(userId);

    res.status(StatusCodes.OK).json(contents);
  });
}
