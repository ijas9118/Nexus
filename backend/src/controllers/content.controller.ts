import { inject, injectable } from "inversify";
import { ContentService } from "../services/content.service";
import { TYPES } from "../di/types";
import { IContentController } from "../core/interfaces/controllers/IContentController";
import { Request, Response } from "express";

@injectable()
export class ContentController implements IContentController {
  constructor(@inject(TYPES.ContentService) private contentService: ContentService) {}

  createContent: IContentController["createContent"] = async (req, res) => {
    try {
      const contentData = { ...req.body, author: req.user.userId };
      const content = await this.contentService.createContent(contentData);
      res.status(201).json(content);
    } catch (error) {
      res.status(400).json({ message: "Failed to create content", error });
    }
  };

  async getContent(req: Request, res: Response): Promise<void> {
    try {
      const content = await this.contentService.getContentById(req.params.id);
      if (content) {
        res.json(content);
      } else {
        res.status(404).json({ message: "Content not found" });
      }
    } catch (error) {
      res.status(400).json({ message: "Failed to get content", error });
    }
  }

  async getAllContent(req: Request, res: Response): Promise<void> {
    try {
      const contents = await this.contentService.getAllContent();
      res.json(contents);
    } catch (error) {
      res.status(400).json({ message: "Failed to get contents", error });
    }
  }

  async likeContent(req: Request, res: Response): Promise<void> {
    // try {
    //   const content = await this.contentService.likeContent(
    //     req.params.id,
    //     req.user.userId
    //   );
    //   if (content) {
    //     res.json(content);
    //   } else {
    //     res.status(404).json({ message: "Content not found" });
    //   }
    // } catch (error) {
    //   res.status(400).json({ message: "Failed to like content", error });
    // }
  }

  async unlikeContent(req: Request, res: Response): Promise<void> {
    // try {
    //   const content = await this.contentService.unlikeContent(
    //     req.params.id,
    //     req.user.userId
    //   );
    //   if (content) {
    //     res.json(content);
    //   } else {
    //     res.status(404).json({ message: "Content not found" });
    //   }
    // } catch (error) {
    //   res.status(400).json({ message: "Failed to unlike content", error });
    // }
  }
}
