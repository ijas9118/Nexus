import { inject, injectable } from "inversify";
import { IFollowersService } from "../core/interfaces/services/IFollowersService";
import { TYPES } from "../di/types";
import { IFollowersRepository } from "../core/interfaces/repositories/IFollowersRepository";

@injectable()
export class FollowersService implements IFollowersService {
  constructor(
    @inject(TYPES.FollowersRepository) private followersRepository: IFollowersRepository
  ) {}

  followUser = async (followerId: string, followedId: string): Promise<boolean> => {
    return this.followersRepository.followUser(followerId, followedId);
  };

  unfollowUser = async (followerId: string, followedId: string): Promise<boolean> => {
    return this.followersRepository.unfollowUser(followerId, followedId);
  };

  getFollowers = async (userId: string): Promise<any[]> => {
    return this.followersRepository.getFollowers(userId);
  };

  getFollowing = async (userId: string): Promise<any[]> => {
    return this.followersRepository.getFollowing(userId);
  };

  isFollowing = async (followerId: string, followedId: string): Promise<boolean> => {
    return this.followersRepository.isFollowing(followerId, followedId);
  };

  getAllConnections = async (userId: string): Promise<any> => {
    return this.followersRepository.getAllConnections(userId);
  };

  getPendingRequest = async (userId: string): Promise<any> => {
    return this.followersRepository.getPendingRequests(userId);
  };

  sendConnectionRequest = async (
    requesterId: string,
    recipientId: string
  ): Promise<boolean> => {
    return this.followersRepository.sendConnectionRequest(requesterId, recipientId);
  };

  acceptConnectionRequest = async (
    userId: string,
    requesterId: string
  ): Promise<boolean> => {
    return this.followersRepository.acceptConnectionRequest(userId, requesterId);
  };

  hasSentConnectionRequest = async (
    requesterId: string,
    recipientId: string
  ): Promise<boolean> => {
    return this.followersRepository.hasSentConnectionRequest(requesterId, recipientId);
  };

  withdrawConnectionRequest = async (
    requesterId: string,
    recipientId: string
  ): Promise<boolean> => {
    return this.followersRepository.withdrawConnectionRequest(requesterId, recipientId);
  };
}
