import { Request, Response } from "express";
import { CustomRequest } from "../../types/CustomRequest";

export interface IFollowersController {
  followUser(req: CustomRequest, res: Response): Promise<void>;
  unfollowUser(req: CustomRequest, res: Response): Promise<void>;
  getFollowers(req: Request, res: Response): Promise<void>;
  getFollowing(req: Request, res: Response): Promise<void>;
  isFollowing(req: Request, res: Response): Promise<void>;
  sendConnectionRequest(req: CustomRequest, res: Response): Promise<void>;
  acceptConnectionRequest(req: CustomRequest, res: Response): Promise<void>;
  hasSentConnectionRequest(req: CustomRequest, res: Response): Promise<void>;
  withdrawConnectionRequest(req: CustomRequest, res: Response): Promise<void>;
  getAllConnections(req: CustomRequest, res: Response): Promise<void>;
}
