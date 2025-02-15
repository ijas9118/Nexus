import { inject, injectable } from "inversify";
import { ContentService } from "../services/content.service";
import { TYPES } from "../di/types";
import { IContentController } from "../core/interfaces/controllers/IContentController";
import { Request, Response } from "express";
import { CustomRequest } from "../core/types/CustomRequest";
import { HistoryService } from "../services/history.service";

@injectable()
export class ContentController implements IContentController {
  constructor(
    @inject(TYPES.ContentService) private contentService: ContentService,
    @inject(TYPES.HistoryService) private historyService: HistoryService
  ) {}

  async createContent(req: CustomRequest, res: Response): Promise<void> {
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

  async getContent(req: CustomRequest, res: Response): Promise<void> {
    try {
      const content = await this.contentService.getContentById(req.params.id);
      if (content) {
        await this.historyService.addHistory(
          req.user?._id as string,
          content._id as string,
        );
        res.json(content);
      } else {
        res.status(404).json({ message: "Content not found" });
      }
    } catch (error) {
      res.status(400).json({ message: "Failed to get content", error });
    }
  }

  async getAllContent(req: CustomRequest, res: Response): Promise<void> {
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
}
