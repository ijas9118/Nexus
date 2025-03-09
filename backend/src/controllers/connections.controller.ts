import { Response } from 'express';
import { CustomRequest } from '../core/types/CustomRequest';
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

  getAllConnections = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const { search } = req.query;

    const result = await this.connectionsService.getAllConnections(userId, search as string);

    res.status(StatusCodes.OK).json(result);
  });

  getPendingRequests = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const userId = req.user?._id as string;

    const result = await this.connectionsService.getPendingRequest(userId);

    res.status(StatusCodes.OK).json(result);
  });

  sendConnectionRequest = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const requesterId = req.user?._id as string;
    const { recipientId } = req.body;

    const result = await this.connectionsService.sendConnectionRequest(requesterId, recipientId);

    if (!result) {
      throw new CustomError('Failed to send connection request', StatusCodes.BAD_REQUEST);
    }

    res.status(StatusCodes.OK).json({ success: true });
  });

  acceptConnectionRequest = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<void> => {
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
    }
  );

  hasSentConnectionRequest = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<void> => {
      const requesterId = req.user?._id as string;
      const { recipientId } = req.body;

      if (!recipientId) {
        throw new CustomError('Recipient ID is required', StatusCodes.BAD_REQUEST);
      }

      const result = await this.connectionsService.hasSentConnectionRequest(
        requesterId,
        recipientId
      );

      res.status(StatusCodes.OK).json({ result });
    }
  );

  withdrawConnectionRequest = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<void> => {
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
    }
  );

  isConnected = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const userId1 = req.user?._id as string;
    const { userId2 } = req.body;

    if (!userId2) {
      throw new CustomError('User ID is required', StatusCodes.BAD_REQUEST);
    }

    const result = await this.connectionsService.isConnected(userId1, userId2);

    res.status(StatusCodes.OK).json({ result });
  });
}
