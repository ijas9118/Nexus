import { Request, Response } from 'express';
import { IChatController } from '../core/interfaces/controllers/IChatController';
import { IChatService } from '../core/interfaces/services/IChatService';
import { inject, injectable } from 'inversify';
import { TYPES } from '../di/types';
import { CustomRequest } from '../core/types/CustomRequest';
import asyncHandler from 'express-async-handler';
import CustomError from '../utils/CustomError';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class ChatController implements IChatController {
  constructor(@inject(TYPES.ChatService) private chatService: IChatService) {}

  createChat = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const { member } = req.body;
    const userId = req.user?._id as string;

    if (!member) throw new CustomError('Member ID is required', StatusCodes.BAD_REQUEST);

    const chat = await this.chatService.createNewChat([userId, member]);

    if (!chat) throw new CustomError('Failed to create chat', StatusCodes.INTERNAL_SERVER_ERROR);

    res.status(StatusCodes.CREATED).json(chat);
  });

  getAllChats = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const userId = req.user?._id as string;

    let result = await this.chatService.getAllChats(userId);

    if (!result) throw new CustomError('Failed to fetch chats', StatusCodes.INTERNAL_SERVER_ERROR);

    res.status(StatusCodes.OK).json(result);
  });
}
