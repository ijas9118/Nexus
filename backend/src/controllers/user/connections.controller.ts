import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IConnectionsController } from "@/core/interfaces/controllers/i-connections-controller";
import type { IConnectionService } from "@/core/interfaces/services/i-connection-service";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { USER_MESSAGES } = MESSAGES;

@injectable()
export class ConnectionsController implements IConnectionsController {
  constructor(@inject(TYPES.ConnectionService) private _connectionsService: IConnectionService) {}

  searchConnections = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const search: string = req.query.search as string;

    if (search === undefined || search === null) {
      throw new CustomError(USER_MESSAGES.SEARCH_TERM_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const sanitizedSearchTerm = search.replace(/[^\w\s@.'-]/g, "").trim();

    if (sanitizedSearchTerm.length === 0) {
      throw new CustomError(USER_MESSAGES.SEARCH_TERM_EMPTY, StatusCodes.BAD_REQUEST);
    }

    const result = await this._connectionsService.searchConnections(userId, sanitizedSearchTerm);

    res.status(StatusCodes.OK).json(result);
  });

  sendConnectionRequest = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const requesterId = req.user?._id as string;
    const { recipientId } = req.body;

    if (!recipientId) {
      throw new CustomError(USER_MESSAGES.RECIPIENT_ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const result = await this._connectionsService.sendConnectionRequest(requesterId, recipientId);

    switch (result) {
      case "ALREADY_SENT":
        throw new CustomError(USER_MESSAGES.ALREADY_SENT, StatusCodes.CONFLICT);
      case "ALREADY_CONNECTED":
        throw new CustomError(USER_MESSAGES.ALREADY_CONNECTED, StatusCodes.CONFLICT);
      case "SELF_REQUEST":
        throw new CustomError(USER_MESSAGES.SELF_REQUEST, StatusCodes.BAD_REQUEST);
      case "SUCCESS":
        res
          .status(StatusCodes.OK)
          .json({ success: true, message: USER_MESSAGES.REQUEST_SENT });
    }
  });

  acceptConnectionRequest = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const { requesterId } = req.body;

    if (!requesterId) {
      throw new CustomError(USER_MESSAGES.REQUESTER_ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const result = await this._connectionsService.acceptConnectionRequest(userId, requesterId);

    if (!result) {
      throw new CustomError(USER_MESSAGES.ACCEPT_FAILED, StatusCodes.BAD_REQUEST);
    }

    res.status(StatusCodes.OK).json({ success: true });
  });

  rejectConnectionRequest = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const { requesterId } = req.body;

    if (!requesterId) {
      throw new CustomError(USER_MESSAGES.REQUESTER_ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const result = await this._connectionsService.rejectConnectionRequest(userId, requesterId);

    if (!result) {
      throw new CustomError(USER_MESSAGES.REJECT_FAILED, StatusCodes.BAD_REQUEST);
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: USER_MESSAGES.REQUEST_REJECTED,
    });
  });

  hasSentConnectionRequest = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const requesterId = req.user?._id as string;
    const { recipientId } = req.body;

    if (!recipientId) {
      throw new CustomError(USER_MESSAGES.RECIPIENT_ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const result = await this._connectionsService.hasSentConnectionRequest(
      requesterId,
      recipientId,
    );

    res.status(StatusCodes.OK).json({ result });
  });

  withdrawConnectionRequest = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const requesterId = req.user?._id as string;
    const { recipientId } = req.body;

    if (!recipientId) {
      throw new CustomError(USER_MESSAGES.RECIPIENT_ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const result = await this._connectionsService.withdrawConnectionRequest(
      requesterId,
      recipientId,
    );

    if (!result) {
      throw new CustomError(USER_MESSAGES.WITHDRAW_FAILED, StatusCodes.BAD_REQUEST);
    }

    res.status(StatusCodes.OK).json({ result });
  });

  isConnected = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId1 = req.user?._id as string;
    const { userId2 } = req.body;

    if (!userId2) {
      throw new CustomError(USER_MESSAGES.USER_ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const result = await this._connectionsService.isConnected(userId1, userId2);

    res.status(StatusCodes.OK).json({ result });
  });

  removeConnection = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const { connectionId } = req.body;

    if (!connectionId) {
      throw new CustomError(USER_MESSAGES.CONNECTION_ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const result = await this._connectionsService.removeConnection(userId, connectionId);

    if (!result) {
      throw new CustomError(USER_MESSAGES.REMOVE_FAILED, StatusCodes.BAD_REQUEST);
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: USER_MESSAGES.REMOVED,
    });
  });

  getAllConnections = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;

    const data = await this._connectionsService.getAllConnections(userId);

    res.status(StatusCodes.OK).json({ data });
  });

  getPendingRequests = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;

    const result = await this._connectionsService.getPendingRequest(userId);

    res.status(StatusCodes.OK).json(result);
  });

  getSentConnectionRequests = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;

    const result = await this._connectionsService.getSentConnectionRequests(userId);

    res.status(StatusCodes.OK).json(result);
  });
}
