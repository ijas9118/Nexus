import { inject, injectable } from 'inversify';
import { IMessageService } from '../core/interfaces/services/IMessageService';
import { Request, Response, Express } from 'express';
import { IMessageController } from '../core/interfaces/controllers/IMessageController';
import { TYPES } from '../di/types';
import asyncHandler from 'express-async-handler';
import CustomError from '../utils/CustomError';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class MessageController implements IMessageController {
  constructor(@inject(TYPES.MessageService) private messageService: IMessageService) {}

  getAllMessages = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user1 = req.user?._id as string;
    const user2 = req.body.id;

    if (!user1 || !user2) {
      throw new CustomError('Both user ids are required', StatusCodes.BAD_REQUEST);
    }

    const messages = await this.messageService.getAllMessages(user1, user2);

    if (!messages) {
      throw new CustomError('Failed to fetch messages', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res
      .status(StatusCodes.OK)
      .json({ message: 'Fetched all messages', data: messages, success: true });
  });

  getUsersWithChats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;

    const chats = await this.messageService.getUsersWithChats(userId);

    res.status(StatusCodes.OK).json(chats);
  });

  uploadFile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const file = req.file as Express.Multer.File;

    if (!file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const result = await this.messageService.uploadFile(file);

    res.status(StatusCodes.OK).json({ ...result });
  });
}
