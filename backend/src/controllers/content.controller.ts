import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IContentController } from "../core/interfaces/controllers/IContentController";
import { Response } from "express";
import { CustomRequest } from "../core/types/CustomRequest";
import { IContentService } from "../core/interfaces/services/IContentService";
import { IHistoryService } from "../core/interfaces/services/IHistoryService";
import asyncHandler from "express-async-handler";

@injectable()
export class ContentController implements IContentController {
  constructor(
    @inject(TYPES.ContentService) private contentService: IContentService,
    @inject(TYPES.HistoryService) private historyService: IHistoryService
  ) {}

  createContent = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<void> => {
      try {
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
        res.status(201).json({
          success: true,
          message: "Content created successfully",
          contentId: content._id,
        });
      } catch (error) {
        res.status(400).json({ message: "Failed to create content", error });
      }
    }
  );

  getContent = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const content = await this.contentService.getContentById(req.params.id);
      if (content) {
        await this.historyService.addHistory(
          req.user?._id as string,
          content._id as string
        );
        res.json(content);
      } else {
        res.status(404).json({ message: "Content not found" });
      }
    } catch (error) {
      res.status(400).json({ message: "Failed to get content", error });
    }
  });

  getAllContent = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<void> => {
      try {
        if (!req.user) {
          res.status(401).json({ message: "User is not authenticated" });
          return;
        }
        const contents = await this.contentService.getAllContent(req.user._id);
        res.json(contents);
      } catch (error) {
        res.status(400).json({ message: "Failed to get contents", error });
      }
    }
  );
}
