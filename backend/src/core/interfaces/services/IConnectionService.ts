import { IPendingRequestUser, SearchConnections } from '../../types/UserTypes';

export interface IConnectionService {
  searchConnections(userId: string, search?: string): Promise<SearchConnections[]>;
  getPendingRequest(userId: string): Promise<IPendingRequestUser[]>;
  sendConnectionRequest(requesterId: string, recipientId: string): Promise<boolean>;
  acceptConnectionRequest(userId: string, requesterId: string): Promise<boolean>;
  hasSentConnectionRequest(requesterId: string, recipientId: string): Promise<boolean>;
  withdrawConnectionRequest(requesterId: string, recipientId: string): Promise<boolean>;
  isConnected(userId1: string, userId2: string): Promise<boolean>;
}
