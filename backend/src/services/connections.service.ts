import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IConnectionService } from "../core/interfaces/services/IConnectionService";
import { IConnectionsRepository } from "../core/interfaces/repositories/IConnectionsRepository";

@injectable()
export class ConnectionService implements IConnectionService {
  constructor(
    @inject(TYPES.ConnectionsRepository)
    private connectionsRepository: IConnectionsRepository
  ) {}

  getAllConnections = async (userId: string, search?: string): Promise<any> => {
    return this.connectionsRepository.getAllConnections(userId, search);
  };

  getPendingRequest = async (userId: string): Promise<any> => {
    return this.connectionsRepository.getPendingRequests(userId);
  };

  sendConnectionRequest = async (
    requesterId: string,
    recipientId: string
  ): Promise<boolean> => {
    return this.connectionsRepository.sendConnectionRequest(requesterId, recipientId);
  };

  acceptConnectionRequest = async (
    userId: string,
    requesterId: string
  ): Promise<boolean> => {
    return this.connectionsRepository.acceptConnectionRequest(userId, requesterId);
  };

  hasSentConnectionRequest = async (
    requesterId: string,
    recipientId: string
  ): Promise<boolean> => {
    return this.connectionsRepository.hasSentConnectionRequest(requesterId, recipientId);
  };

  withdrawConnectionRequest = async (
    requesterId: string,
    recipientId: string
  ): Promise<boolean> => {
    return this.connectionsRepository.withdrawConnectionRequest(requesterId, recipientId);
  };

  isConnected = async (userId1: string, userId2: string): Promise<boolean> => {
    return this.connectionsRepository.isConnected(userId1, userId2);
  };
}
