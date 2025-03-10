import { IUserFollow } from '../../../models/followers.model';
import { IPendingRequestUser } from '../../types/UserTypes';

export interface IConnectionsRepository {
  getAllConnections(userId: string, search?: string): Promise<IUserFollow[]>;
  getPendingRequests(userId: string): Promise<IPendingRequestUser[]>;
  sendConnectionRequest(requesterId: string, recipientId: string): Promise<boolean>;
  acceptConnectionRequest(requesterId: string, recipientId: string): Promise<boolean>;
  hasSentConnectionRequest(requesterId: string, recipientId: string): Promise<boolean>;
  withdrawConnectionRequest(requesterId: string, recipientId: string): Promise<boolean>;
  isConnected(userId1: string, userId2: string): Promise<boolean>;
}
