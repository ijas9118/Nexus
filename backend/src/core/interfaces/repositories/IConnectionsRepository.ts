import { IPendingRequestUser, SearchConnections } from '../../types/UserTypes';

export interface IConnectionsRepository {
  searchConnections(userId: string, search?: string): Promise<SearchConnections[]>;
  getPendingRequests(userId: string): Promise<IPendingRequestUser[]>;
  sendConnectionRequest(
    requesterId: string,
    recipientId: string
  ): Promise<'ALREADY_SENT' | 'SUCCESS'>;
  acceptConnectionRequest(requesterId: string, recipientId: string): Promise<boolean>;
  hasSentConnectionRequest(requesterId: string, recipientId: string): Promise<boolean>;
  withdrawConnectionRequest(requesterId: string, recipientId: string): Promise<boolean>;
  isConnected(userId1: string, userId2: string): Promise<boolean>;
  getAllConnections(userId: string): Promise<any[]>;
}
