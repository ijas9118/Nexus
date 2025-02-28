import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IContentController } from "../core/interfaces/controllers/IContentController";
import { Response } from "express";
import { CustomRequest } from "../core/types/CustomRequest";
import { IContentService } from "../core/interfaces/services/IContentService";
import { IHistoryService } from "../core/interfaces/services/IHistoryService";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import CustomError from "../utils/CustomError";

@injectable()
export class ContentController implements IContentController {
  constructor(
    @inject(TYPES.ContentService) private contentService: IContentService,
    @inject(TYPES.HistoryService) private historyService: IHistoryService
  ) {}

  createContent = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<void> => {
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

      const content = await this.contentService.createContent(contentData);
      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Content created successfully",
        contentId: content._id,
      });
    }
  );

  getContent = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const content = await this.contentService.getContentById(req.params.id);

    if (!content) throw new CustomError("Content not found", StatusCodes.NOT_FOUND);

    await this.historyService.addHistory(req.user?._id as string, content._id as string);

    res.status(StatusCodes.OK).json(content);
  });

  getAllContent = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<void> => {
      if (!req.user)
        throw new CustomError("User is not authenticated", StatusCodes.UNAUTHORIZED);

      const contents = await this.contentService.getAllContent(req.user._id);
      res.status(StatusCodes.OK).json(contents);
    }
  );
}
