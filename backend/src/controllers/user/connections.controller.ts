import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IConnectionsController } from "@/core/interfaces/controllers/i-connections-controller";
import type { IConnectionService } from "@/core/interfaces/services/i-connection-service";

import { TYPES } from "@/di/types";
import CustomError from "@/utils/custom-error";

@injectable()
export class ConnectionsController implements IConnectionsController {
  constructor(@inject(TYPES.ConnectionService) private _connectionsService: IConnectionService) {}

  searchConnections = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const search: string = req.query.search as string;

    if (search === undefined || search === null) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Search term is required" });
      return;
    }

    const sanitizedSearchTerm = search.replace(/[^\w\s@.'-]/g, "").trim();

    if (sanitizedSearchTerm.length === 0) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Search term cannot be empty after sanitization" });
      return;
    }

    const result = await this._connectionsService.searchConnections(userId, sanitizedSearchTerm);

    res.status(StatusCodes.OK).json(result);
  });

  sendConnectionRequest = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const requesterId = req.user?._id as string;
    const { recipientId } = req.body;

    if (!recipientId) {
      throw new CustomError("Recipient ID is required", StatusCodes.BAD_REQUEST);
    }

    const result = await this._connectionsService.sendConnectionRequest(requesterId, recipientId);

    if (result === "ALREADY_SENT") {
      res
        .status(StatusCodes.CONFLICT)
        .json({ success: false, message: "Connection request already sent" });
      return;
    }

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Connection request sent successfully" });
  });

  acceptConnectionRequest = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const { requesterId } = req.body;

    if (!requesterId) {
      throw new CustomError("Requester ID is required", StatusCodes.BAD_REQUEST);
    }

    const result = await this._connectionsService.acceptConnectionRequest(userId, requesterId);

    if (!result) {
      throw new CustomError("Failed to accept connection request", StatusCodes.BAD_REQUEST);
    }

    res.status(StatusCodes.OK).json({ success: true });
  });

  hasSentConnectionRequest = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const requesterId = req.user?._id as string;
    const { recipientId } = req.body;

    if (!recipientId) {
      throw new CustomError("Recipient ID is required", StatusCodes.BAD_REQUEST);
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
      throw new CustomError("Recipient ID is required", StatusCodes.BAD_REQUEST);
    }

    const result = await this._connectionsService.withdrawConnectionRequest(
      requesterId,
      recipientId,
    );

    if (!result) {
      throw new CustomError("Failed to withdraw connection request", StatusCodes.BAD_REQUEST);
    }

    res.status(StatusCodes.OK).json({ result });
  });

  isConnected = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId1 = req.user?._id as string;
    const { userId2 } = req.body;

    if (!userId2) {
      throw new CustomError("User ID is required", StatusCodes.BAD_REQUEST);
    }

    const result = await this._connectionsService.isConnected(userId1, userId2);

    res.status(StatusCodes.OK).json({ result });
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
