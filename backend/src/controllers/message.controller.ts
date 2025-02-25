import { inject, injectable } from "inversify";
import { IMessageService } from "../core/interfaces/services/IMessageService";
import { Request, Response } from "express";
import { IMessageController } from "../core/interfaces/controllers/IMessageController";
import { TYPES } from "../di/types";

@injectable()
export class MessageController implements IMessageController {
  constructor(@inject(TYPES.MessageService) private messageService: IMessageService) {}

  createNewMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { chatId, sender, text } = req.body;
      const message = await this.messageService.createNewMessage({
        chatId,
        sender,
        text,
      });
      res.status(201).json({ message: "Message created", data: message, success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message, success: false });
    }
  };

  getAllMessages = async (req: Request, res: Response): Promise<void> => {
    try {
      const messages = await this.messageService.getAllMessages(req.params.chatId);
      res
        .status(200)
        .json({ message: "Fetched all messages", data: messages, success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message, success: false });
    }
  };
}
