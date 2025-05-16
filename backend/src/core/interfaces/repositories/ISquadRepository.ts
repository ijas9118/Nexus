import { SearchCriteria, SearchResultItem } from '@/core/types/search';
import { ISquad } from '../../../models/squads.model';
import { BaseRepository } from '../../abstracts/base.repository';

export interface ISquadRepository extends BaseRepository<ISquad> {
  addMemberToSquad(userId: string, squadId: string): unknown;
  getSquadsByCategory(category: string, userId: string): ISquad[] | PromiseLike<ISquad[]>;
  toggleSquad(id: string): ISquad | PromiseLike<ISquad | null> | null;
  getSquadById(id: string): Promise<ISquad | null>;
  getAllSquads(): Promise<ISquad[]>;
  search(criteria: SearchCriteria): Promise<SearchResultItem[]>;
}
