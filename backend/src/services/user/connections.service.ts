// connection.service.ts
import { inject, injectable } from "inversify";

import type { IConnectionsRepository } from "@/core/interfaces/repositories/i-connections-repository";
import type { IConnectionService } from "@/core/interfaces/services/i-connection-service";
import type { IPendingRequestUser, SearchConnections } from "@/core/types/user-types";

import { TYPES } from "@/di/types";

@injectable()
export class ConnectionService implements IConnectionService {
  constructor(
    @inject(TYPES.ConnectionsRepository)
    private connectionsRepository: IConnectionsRepository,
  ) {}

  searchConnections = async (userId: string, search?: string): Promise<SearchConnections[]> => {
    return this.connectionsRepository.searchConnections(userId, search);
  };

  getPendingRequest = async (userId: string): Promise<IPendingRequestUser[]> => {
    return this.connectionsRepository.getPendingRequests(userId);
  };

  getSentConnectionRequests = async (userId: string): Promise<IPendingRequestUser[]> => {
    return this.connectionsRepository.getSentConnectionRequests(userId);
  };

  sendConnectionRequest = async (
    requesterId: string,
    recipientId: string,
  ): Promise<"ALREADY_SENT" | "SUCCESS"> => {
    return this.connectionsRepository.sendConnectionRequest(requesterId, recipientId);
  };

  acceptConnectionRequest = async (userId: string, requesterId: string): Promise<boolean> => {
    return this.connectionsRepository.acceptConnectionRequest(userId, requesterId);
  };

  hasSentConnectionRequest = async (requesterId: string, recipientId: string): Promise<boolean> => {
    return this.connectionsRepository.hasSentConnectionRequest(requesterId, recipientId);
  };

  withdrawConnectionRequest = async (
    requesterId: string,
    recipientId: string,
  ): Promise<boolean> => {
    return this.connectionsRepository.withdrawConnectionRequest(requesterId, recipientId);
  };

  isConnected = async (userId1: string, userId2: string): Promise<boolean> => {
    return this.connectionsRepository.isConnected(userId1, userId2);
  };

  getAllConnections = async (userId: string): Promise<any[]> => {
    return this.connectionsRepository.getAllConnections(userId);
  };
}
