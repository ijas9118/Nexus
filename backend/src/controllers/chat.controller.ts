import { Request, Response } from "express";
import { IChatController } from "../core/interfaces/controllers/IChatController";
import { IChatService } from "../core/interfaces/services/IChatService";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { CustomRequest } from "../core/types/CustomRequest";

@injectable()
export class ChatController implements IChatController {
  constructor(@inject(TYPES.ChatService) private chatService: IChatService) {}

  createChat = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { member } = req.body;
      const chat = await this.chatService.createNewChat([
        req.user?._id as string,
        member,
      ]);
      res.status(201).json({ message: "Chat created", success: true, data: chat });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error creating chat", error: error.message, success: false });
    }
  };

  getAllChats = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const allChat = await this.chatService.getAllChats(req.user?._id as string);
      res
        .status(200)
        .json({ message: "All chats fetched", success: true, data: allChat });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error fetching chats", error: error.message, success: false });
    }
  };
}
