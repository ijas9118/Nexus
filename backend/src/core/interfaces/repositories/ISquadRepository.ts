import { SearchCriteria, SearchResultItem } from '@/core/types/search';
import { ISquad } from '../../../models/squads.model';
import { BaseRepository } from '../../abstracts/base.repository';
import { SquadWithIsJoined } from '@/core/types/squad';

export interface ISquadRepository extends BaseRepository<ISquad> {
  addMemberToSquad(userId: string, squadId: string): unknown;
  getSquadsByCategory(category: string, userId: string): Promise<SquadWithIsJoined[]>;
  toggleSquad(id: string): ISquad | PromiseLike<ISquad | null> | null;
  getSquadById(id: string): Promise<ISquad | null>;
  getAllSquads(): Promise<ISquad[]>;
  search(criteria: SearchCriteria): Promise<SearchResultItem[]>;
  getSquadDetailsByHandle(handle: string, userId: string): Promise<ISquad>;
  removeMemberFromSquad(userId: string, squadId: string): Promise<void>;
  getJoinedSquads(userId: string): Promise<(ISquad & { isAdmin: boolean })[]>;
  countSquads(): Promise<number>;
}
