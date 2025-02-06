import { inject, injectable } from "inversify";
import { BaseService } from "../core/abstracts/base.service";
import { ISquadService } from "../core/interfaces/services/ISquadService";
import { ISquad } from "../models/squads.model";
import { SquadRepository } from "../repositories/squad.repository";
import { TYPES } from "../di/types";

@injectable()
export class SquadService extends BaseService<ISquad> implements ISquadService {
  constructor(@inject(TYPES.SquadRepository) private squadRepository: SquadRepository) {
    super(squadRepository);
  }

  createSquad = async (squadData: Partial<ISquad>): Promise<ISquad> => {
    return await this.create(squadData);
  };

  getSquadByName = async (name: string): Promise<ISquad | null> => {
    return await this.findOne({ name });
  };

  getAllSquads = async (): Promise<ISquad[]> => {
    return await this.squadRepository.getAllSquads();
  };

  getSquadById = async (id: string): Promise<ISquad | null> => {
    return await this.squadRepository.getSquadById(id);
  };

  toggleSquad = async (id: string): Promise<ISquad | null> => {
    return await this.squadRepository.toggleSquad(id);
  };
}
