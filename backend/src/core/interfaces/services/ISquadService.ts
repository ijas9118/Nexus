import { SquadByCategoryResponseDto } from '@/dtos/responses/sqauds.dto';
import { SquadContentResponseDto } from '@/dtos/responses/squad-contents.dto';
import { ISquad } from '@/models/squads.model';
import { Express } from 'express';

export interface ISquadService {
  joinSquad(userId: string, squadId: string): unknown;
  getSquadsByCategory(userId: string, category: string): Promise<SquadByCategoryResponseDto[]>;
  toggleSquad(id: string): unknown;
  createSquad(squadData: Partial<ISquad>, logoFile?: Express.Multer.File): Promise<ISquad>;
  getSquadByName(name: string): Promise<ISquad | null>;
  getSquadDetailsByHandle(handle: string, userId: string): Promise<ISquad | null>;
  getAllSquads(): Promise<ISquad[]>;
  getSquadById(id: string): Promise<ISquad | null>;
  getSquadContents(
    squadId: string,
    role: string,
    userId: string
  ): Promise<SquadContentResponseDto[]>;
  leaveSquad(userId: string, squadId: string): Promise<void>;
  getJoinedSquads(id: string): Promise<any | null>;
}
