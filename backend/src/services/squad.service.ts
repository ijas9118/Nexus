import { inject, injectable } from "inversify";
import { BaseService } from "../core/abstracts/base.service";
import { ISquadService } from "../core/interfaces/services/ISquadService";
import { ISquad } from "../models/squads.model";
import { SquadRepository } from "../repositories/squad.repository";
import { TYPES } from "../di/types";
import { CategoryRepository } from "../repositories/category.repository";
import { UserRepository } from "../repositories/user.repository";

@injectable()
export class SquadService extends BaseService<ISquad> implements ISquadService {
  constructor(
    @inject(TYPES.SquadRepository) private squadRepository: SquadRepository,
    @inject(TYPES.CategoryRepository) private categoryRepository: CategoryRepository
  ) {
    super(squadRepository);
  }

  createSquad = async (squadData: Partial<ISquad>): Promise<ISquad> => {
    const { category } = squadData;
    if (!category || typeof category !== "string") {
      throw new Error("Invalid category provided");
    }

    const categoryObj = await this.categoryRepository.findOne({ name: category });
    if (!categoryObj) {
      throw new Error("Category not found");
    }

    const squad = await this.create(squadData);

    categoryObj.squads.push(squad._id);
    categoryObj.squadCount += 1;

    await categoryObj.save();
    return squad;
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

  getSquadsByCategory = async (userId: string, category: string): Promise<ISquad[]> => {
    return await this.squadRepository.getSquadsByCategory(category, userId);
  };

  joinSquad = async (userId: string, squadId: string) => {
    await this.squadRepository.addMemberToSquad(userId, squadId);
  };
}
