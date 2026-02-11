import type { ISquad } from "@/models/social/squads.model";

export type SquadWithIsJoined = ISquad & { isJoined: boolean };

export interface ISquadAggregated extends ISquad {
  adminId: string;
  adminProfilePic: string;
  adminName: string;
  category: string;
}
