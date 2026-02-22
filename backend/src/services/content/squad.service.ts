import type { Express } from "express";

import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { ICategoryRepository } from "@/core/interfaces/repositories/i-category-repository";
import type { IContentRepository } from "@/core/interfaces/repositories/i-content-repository";
import type { ISquadRepository } from "@/core/interfaces/repositories/i-squad-repository";
import type { ISquadService } from "@/core/interfaces/services/i-squad-service";
import type { UserRole } from "@/core/types/user-types";
import type { ISquad } from "@/models/social/squads.model";

import { TYPES } from "@/di/types";
import { SquadListDto } from "@/dtos/responses/admin/squad-list-dto";
import { SquadByCategoryResponseDto } from "@/dtos/responses/sqauds.dto";
import { SquadContentResponseDto } from "@/dtos/responses/squad-contents.dto";
import { uploadToCloudinary } from "@/utils/cloudinary-utils";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { SQUAD_MESSAGES, CATEGORY_MESSAGES, USER_MESSAGES } = MESSAGES;

@injectable()
export class SquadService implements ISquadService {
  constructor(
    @inject(TYPES.SquadRepository) private _squadRepository: ISquadRepository,
    @inject(TYPES.CategoryRepository) private _categoryRepository: ICategoryRepository,
    @inject(TYPES.ContentRepository) private _contentRepository: IContentRepository,
    @inject(TYPES.UserRepository) private _userRepository: IContentRepository,
  ) {}

  createSquad = async (
    squadData: Partial<ISquad>,
    logoFile?: Express.Multer.File,
  ): Promise<ISquad> => {
    const { category } = squadData;
    if (!category || typeof category !== "string") {
      throw new CustomError(SQUAD_MESSAGES.INVALID_CATEGORY, StatusCodes.BAD_REQUEST);
    }

    const categoryObj = await this._categoryRepository.findOne({ name: category });
    if (!categoryObj) {
      throw new CustomError(CATEGORY_MESSAGES.NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    // Upload logo to Cloudinary if provided
    let logoUrl: string | undefined;
    if (logoFile) {
      const result = await uploadToCloudinary(logoFile, {
        baseFolder: "images",
        subFolder: "squad-logos",
        resourceType: "image",
      });
      logoUrl = result.url;
    }

    // Update squadData with the logo URL and set category to ObjectId
    const updatedSquadData = {
      ...squadData,
      category: categoryObj._id,
      logo: logoUrl,
    };

    // Create the squad
    const squad = await this._squadRepository.create(updatedSquadData);

    // Update category
    categoryObj.squads.push(squad._id);
    categoryObj.squadCount += 1;
    await categoryObj.save();

    return squad;
  };

  getSquadByName = async (name: string): Promise<ISquad | null> => {
    return await this._squadRepository.findOne({ name });
  };

  getSquadDetailsByHandle = async (handle: string, userId: string): Promise<ISquad | null> => {
    return await this._squadRepository.getSquadDetailsByHandle(handle, userId);
  };

  getAllSquads = async ({
    limit,
    page,
    search,
  }: {
    limit: number;
    page: number;
    search: string;
  }): Promise<SquadListDto[]> => {
    const squads = await this._squadRepository.getAllSquads({ limit, page, search });
    return SquadListDto.fromEntities(squads);
  };

  getSquadById = async (id: string): Promise<ISquad | null> => {
    return await this._squadRepository.getSquadById(id);
  };

  toggleSquad = async (id: string): Promise<ISquad | null> => {
    return await this._squadRepository.toggleSquad(id);
  };

  getJoinedSquads = async (userId: string): Promise<(ISquad & { isAdmin: boolean })[] | null> => {
    const user = await this._userRepository.findOne({ _id: userId });

    if (!user) {
      throw new CustomError(USER_MESSAGES.NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    return await this._squadRepository.getJoinedSquads(userId);
  };

  getSquadsByCategory = async (
    userId: string,
    category: string,
  ): Promise<SquadByCategoryResponseDto[]> => {
    const categoryExists = await this._categoryRepository.findById(category);
    if (!categoryExists) {
      throw new CustomError(CATEGORY_MESSAGES.NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    const squads = await this._squadRepository.getSquadsByCategory(category, userId);

    return SquadByCategoryResponseDto.fromEntities(squads);
  };

  joinSquad = async (userId: string, squadId: string) => {
    await this._squadRepository.addMemberToSquad(userId, squadId);
  };

  leaveSquad = async (userId: string, squadId: string): Promise<void> => {
    const squad = await this.getSquadById(squadId);
    if (!squad) {
      throw new CustomError(SQUAD_MESSAGES.NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    if (!squad.members.includes(userId)) {
      throw new CustomError(SQUAD_MESSAGES.NOT_A_MEMBER, StatusCodes.BAD_REQUEST);
    }
    await this._squadRepository.removeMemberFromSquad(userId, squadId);
  };

  async getSquadContents(
    squadId: string,
    role: string,
    userId: string,
  ): Promise<SquadContentResponseDto[]> {
    const contents = await this._contentRepository.getSquadContents(
      squadId,
      role as UserRole,
      userId,
    );

    return SquadContentResponseDto.fromEntities(contents);
  }
}
