import { ISquad } from '@/models/squads.model';

export type SquadWithIsJoined = ISquad & { isJoined: boolean };
