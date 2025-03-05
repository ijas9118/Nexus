import { inject, injectable } from 'inversify';
import { IMessageService } from '../core/interfaces/services/IMessageService';
import { Request, Response } from 'express';
import { IMessageController } from '../core/interfaces/controllers/IMessageController';
import { TYPES } from '../di/types';
import asyncHandler from 'express-async-handler';
import CustomError from '../utils/CustomError';
import { StatusCodes } from 'http-status-codes';
import { CustomRequest } from '../core/types/CustomRequest';

@injectable()
export class MessageController implements IMessageController {
  constructor(@inject(TYPES.MessageService) private messageService: IMessageService) {}

  createNewMessage = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const { chatId, text } = req.body;

    const sender = req.user?._id;

    if (!chatId || !sender || !text) {
      throw new CustomError(
        'All fields (chatId, sender, text) are required',
        StatusCodes.BAD_REQUEST
      );
    }

    const message = await this.messageService.createNewMessage({
      chatId,
      sender,
      text,
    });

    if (!message) {
      throw new CustomError('Failed to create message', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res
      .status(StatusCodes.CREATED)
      .json({ message: 'Message created', data: message, success: true });
  });

  getAllMessages = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { chatId } = req.params;

    if (!chatId) {
      throw new CustomError('Chat ID is required', StatusCodes.BAD_REQUEST);
    }

    const messages = await this.messageService.getAllMessages(chatId);

    if (!messages) {
      throw new CustomError('Failed to fetch messages', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res
      .status(StatusCodes.OK)
      .json({ message: 'Fetched all messages', data: messages, success: true });
  });
}
