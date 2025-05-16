import { Request, Response } from 'express';

import { inject, injectable } from 'inversify';
import { TYPES } from '../di/types';
import asyncHandler from 'express-async-handler';
import CustomError from '../utils/CustomError';
import { StatusCodes } from 'http-status-codes';
import { IConnectionService } from '../core/interfaces/services/IConnectionService';
import { IConnectionsController } from '../core/interfaces/controllers/IConnectionsController';

@injectable()
export class ConnectionsController implements IConnectionsController {
  constructor(@inject(TYPES.ConnectionService) private connectionsService: IConnectionService) {}

  searchConnections = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const search: string = req.query.search as string;

    if (search === undefined || search === null) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Search term is required' });
      return;
    }

    const sanitizedSearchTerm = search.replace(/[^a-zA-Z0-9\s@._'-]/g, '').trim();

    if (sanitizedSearchTerm.length === 0) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Search term cannot be empty after sanitization' });
      return;
    }

    const result = await this.connectionsService.searchConnections(userId, sanitizedSearchTerm);

    res.status(StatusCodes.OK).json(result);
  });

  getPendingRequests = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;

    const result = await this.connectionsService.getPendingRequest(userId);

    res.status(StatusCodes.OK).json(result);
  });

  sendConnectionRequest = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const requesterId = req.user?._id as string;
    const { recipientId } = req.body;

    if (!recipientId) {
      throw new CustomError('Recipient ID is required', StatusCodes.BAD_REQUEST);
    }

    const result = await this.connectionsService.sendConnectionRequest(requesterId, recipientId);

    if (result === 'ALREADY_SENT') {
      res
        .status(StatusCodes.CONFLICT)
        .json({ success: false, message: 'Connection request already sent' });
      return;
    }

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'Connection request sent successfully' });
  });

  acceptConnectionRequest = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const { requesterId } = req.body;

    if (!requesterId) {
      throw new CustomError('Requester ID is required', StatusCodes.BAD_REQUEST);
    }

    const result = await this.connectionsService.acceptConnectionRequest(userId, requesterId);

    if (!result) {
      throw new CustomError('Failed to accept connection request', StatusCodes.BAD_REQUEST);
    }

    res.status(StatusCodes.OK).json({ success: true });
  });

  hasSentConnectionRequest = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const requesterId = req.user?._id as string;
    const { recipientId } = req.body;

    if (!recipientId) {
      throw new CustomError('Recipient ID is required', StatusCodes.BAD_REQUEST);
    }

    const result = await this.connectionsService.hasSentConnectionRequest(requesterId, recipientId);

    res.status(StatusCodes.OK).json({ result });
  });

  withdrawConnectionRequest = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const requesterId = req.user?._id as string;
    const { recipientId } = req.body;

    if (!recipientId) {
      throw new CustomError('Recipient ID is required', StatusCodes.BAD_REQUEST);
    }

    const result = await this.connectionsService.withdrawConnectionRequest(
      requesterId,
      recipientId
    );

    if (!result) {
      throw new CustomError('Failed to withdraw connection request', StatusCodes.BAD_REQUEST);
    }

    res.status(StatusCodes.OK).json({ result });
  });

  isConnected = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId1 = req.user?._id as string;
    const { userId2 } = req.body;

    if (!userId2) {
      throw new CustomError('User ID is required', StatusCodes.BAD_REQUEST);
    }

    const result = await this.connectionsService.isConnected(userId1, userId2);

    res.status(StatusCodes.OK).json({ result });
  });

  getAllConnections = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;

    const data = await this.connectionsService.getAllConnections(userId);

    res.status(StatusCodes.OK).json({ data });
  });
}
