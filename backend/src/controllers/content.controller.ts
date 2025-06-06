import { inject, injectable } from 'inversify';
import { TYPES } from '../di/types';
import { IContentController } from '../core/interfaces/controllers/IContentController';
import { Request, Response, Express } from 'express';

import { IContentService } from '../core/interfaces/services/IContentService';
import { IHistoryService } from '../core/interfaces/services/IHistoryService';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../utils/CustomError';

@injectable()
export class ContentController implements IContentController {
  constructor(
    @inject(TYPES.ContentService) private contentService: IContentService,
    @inject(TYPES.HistoryService) private historyService: IHistoryService
  ) {}

  createContent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const thumbnailFile = files?.['thumbnail']?.[0];
    const videoFile = files?.['videoFile']?.[0];

    const contentData = {
      ...req.body,
      author: req.user?._id,
      userName: req.user?.name,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
    };

    const content = await this.contentService.createContent(contentData, thumbnailFile, videoFile);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Content created successfully',
      contentId: content._id,
    });
  });

  getContent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const role = req.user?.role as string;
    const userId = req.user?._id as string;

    const content = await this.contentService.getContentById(req.params.id, role, userId);

    if (!content) {
      throw new CustomError('Content not found', StatusCodes.NOT_FOUND);
    }

    if (role === 'user') {
      await this.historyService.addHistory(req.user?._id as string, content._id as string);
    }

    res.status(StatusCodes.OK).json(content);
  });

  getAllContent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new CustomError('User is not authenticated', StatusCodes.UNAUTHORIZED);
    }

    const { page = 1, limit = 10 } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);

    const contents = await this.contentService.getAllContent(req.user._id, pageNum, limitNum);

    // Calculate if there's a next page
    const totalContents = await this.contentService.getContentCount();
    const nextPage = pageNum * limitNum < totalContents ? pageNum + 1 : null;

    res.status(StatusCodes.OK).json({
      contents,
      nextPage,
    });
  });

  getPosts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const contents = await this.contentService.getPosts();
    res.status(StatusCodes.OK).json(contents);
  });

  verifyContent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { contentId } = req.params;

    const updatedContent = await this.contentService.verifyContent(contentId);
    if (!updatedContent) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Content not found' });
      return;
    }

    res
      .status(StatusCodes.OK)
      .json({ message: 'Content verified successfully', content: updatedContent });
  });

  getFollowingUsersContents = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string;

    const contents = await this.contentService.getFollowingUsersContents(userId);

    res.status(200).json(contents);
  });
}
