import type { SearchCriteria, SearchResultItem } from '@/core/types/search';
import type { ISquadAggregated, SquadWithIsJoined } from '@/core/types/squad';

import type { ISquad } from '../../../models/squads.model';
import type { BaseRepository } from '../../abstracts/base.repository';

export interface ISquadRepository extends BaseRepository<ISquad> {
  addMemberToSquad: (userId: string, squadId: string) => unknown;
  getSquadsByCategory: (category: string, userId: string) => Promise<SquadWithIsJoined[]>;
  toggleSquad: (id: string) => ISquad | PromiseLike<ISquad | null> | null;
  getSquadById: (id: string) => Promise<ISquad | null>;
  getAllSquads: (params: {
    limit: number;
    page: number;
    search: string;
  }) => Promise<ISquadAggregated[]>;
  search: (criteria: SearchCriteria) => Promise<SearchResultItem[]>;
  getSquadDetailsByHandle: (handle: string, userId: string) => Promise<ISquad>;
  removeMemberFromSquad: (userId: string, squadId: string) => Promise<void>;
  getJoinedSquads: (userId: string) => Promise<(ISquad & { isAdmin: boolean })[]>;
  countSquads: () => Promise<number>;
  countSquadsBefore: (date: Date) => Promise<number>;
}
