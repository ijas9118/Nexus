import type { Express } from "express";

import type { SquadListDto } from "@/dtos/responses/admin/squad-list-dto";
import type { SquadByCategoryResponseDto } from "@/dtos/responses/sqauds.dto";
import type { SquadContentResponseDto } from "@/dtos/responses/squad-contents.dto";
import type { ISquad } from "@/models/social/squads.model";

export interface ISquadService {
  joinSquad: (userId: string, squadId: string) => unknown;
  getSquadsByCategory: (userId: string, category: string) => Promise<SquadByCategoryResponseDto[]>;
  toggleSquad: (id: string) => unknown;
  createSquad: (squadData: Partial<ISquad>, logoFile?: Express.Multer.File) => Promise<ISquad>;
  getSquadByName: (name: string) => Promise<ISquad | null>;
  getSquadDetailsByHandle: (handle: string, userId: string) => Promise<ISquad | null>;
  getAllSquads: (params: {
    limit: number;
    page: number;
    search: string;
  }) => Promise<SquadListDto[]>;
  getSquadById: (id: string) => Promise<ISquad | null>;
  getSquadContents: (
    squadId: string,
    role: string,
    userId: string,
  ) => Promise<SquadContentResponseDto[]>;
  leaveSquad: (userId: string, squadId: string) => Promise<void>;
  getJoinedSquads: (id: string) => Promise<any | null>;
}
