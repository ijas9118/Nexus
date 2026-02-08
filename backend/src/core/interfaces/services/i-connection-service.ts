import type { IPendingRequestUser, SearchConnections } from "../../types/user-types";

export interface IConnectionService {
  searchConnections: (userId: string, search?: string) => Promise<SearchConnections[]>;
  getPendingRequest: (userId: string) => Promise<IPendingRequestUser[]>;
  getSentConnectionRequests: (userId: string) => Promise<IPendingRequestUser[]>; // New method
  sendConnectionRequest: (
    requesterId: string,
    recipientId: string,
  ) => Promise<"ALREADY_SENT" | "SUCCESS">;
  acceptConnectionRequest: (userId: string, requesterId: string) => Promise<boolean>;
  hasSentConnectionRequest: (requesterId: string, recipientId: string) => Promise<boolean>;
  withdrawConnectionRequest: (requesterId: string, recipientId: string) => Promise<boolean>;
  isConnected: (userId1: string, userId2: string) => Promise<boolean>;
  getAllConnections: (userId: string) => Promise<any[]>;
}
