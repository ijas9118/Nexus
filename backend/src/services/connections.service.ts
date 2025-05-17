// connection.service.ts
import { inject, injectable } from 'inversify';
import { TYPES } from '../di/types';
import { IConnectionService } from '../core/interfaces/services/IConnectionService';
import { IConnectionsRepository } from '../core/interfaces/repositories/IConnectionsRepository';
import { IPendingRequestUser, SearchConnections } from '../core/types/UserTypes';

@injectable()
export class ConnectionService implements IConnectionService {
  constructor(
    @inject(TYPES.ConnectionsRepository)
    private connectionsRepository: IConnectionsRepository
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
    recipientId: string
  ): Promise<'ALREADY_SENT' | 'SUCCESS'> => {
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
    recipientId: string
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
