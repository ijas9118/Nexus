import { inject, injectable } from 'inversify';
import { BaseService } from '../core/abstracts/base.service';
import { ISquadService } from '../core/interfaces/services/ISquadService';
import { ISquad } from '../models/squads.model';
import { TYPES } from '../di/types';
import { ISquadRepository } from '../core/interfaces/repositories/ISquadRepository';
import { ICategoryRepository } from '../core/interfaces/repositories/ICategoryRepository';
import { uploadToCloudinary } from '@/utils/cloudinaryUtils';
import { Express } from 'express';
import CustomError from '@/utils/CustomError';
import { StatusCodes } from 'http-status-codes';
import { SquadByCategoryResponseDto } from '@/dtos/responses/sqauds.dto';
import { IContentRepository } from '@/core/interfaces/repositories/IContentRepository';
import { UserRole } from '@/core/types/UserTypes';
import { SquadContentResponseDto } from '@/dtos/responses/squad-contents.dto';

@injectable()
export class SquadService extends BaseService<ISquad> implements ISquadService {
  constructor(
    @inject(TYPES.SquadRepository) private squadRepository: ISquadRepository,
    @inject(TYPES.CategoryRepository) private categoryRepository: ICategoryRepository,
    @inject(TYPES.ContentRepository) private contentRepository: IContentRepository
  ) {
    super(squadRepository);
  }

  createSquad = async (
    squadData: Partial<ISquad>,
    logoFile?: Express.Multer.File
  ): Promise<ISquad> => {
    const { category } = squadData;
    if (!category || typeof category !== 'string') {
      throw new Error('Invalid category provided');
    }

    const categoryObj = await this.categoryRepository.findOne({ name: category });
    if (!categoryObj) {
      throw new Error('Category not found');
    }

    // Upload logo to Cloudinary if provided
    let logoUrl: string | undefined;
    if (logoFile) {
      const result = await uploadToCloudinary(logoFile, {
        baseFolder: 'images',
        subFolder: 'squad-logos',
        resourceType: 'image',
      });
      logoUrl = result.url;
    }

    // Update squadData with the logo URL
    const updatedSquadData = {
      ...squadData,
      logo: logoUrl,
    };

    // Create the squad
    const squad = await this.create(updatedSquadData);

    // Update category
    categoryObj.squads.push(squad._id);
    categoryObj.squadCount += 1;
    await categoryObj.save();

    return squad;
  };

  getSquadByName = async (name: string): Promise<ISquad | null> => {
    return await this.findOne({ name });
  };

  getSquadDetailsByHandle = async (handle: string): Promise<ISquad | null> => {
    return await this.squadRepository.getSquadDetailsByHandle(handle);
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

  getSquadsByCategory = async (
    userId: string,
    category: string
  ): Promise<SquadByCategoryResponseDto[]> => {
    const categoryExists = await this.categoryRepository.findById(category);
    if (!categoryExists) {
      throw new CustomError('Category not found', StatusCodes.NOT_FOUND);
    }

    const squads = await this.squadRepository.getSquadsByCategory(category, userId);

    return SquadByCategoryResponseDto.fromEntities(squads);
  };

  joinSquad = async (userId: string, squadId: string) => {
    await this.squadRepository.addMemberToSquad(userId, squadId);
  };

  async getSquadContents(
    squadId: string,
    role: string,
    userId: string
  ): Promise<SquadContentResponseDto[]> {
    const contents = await this.contentRepository.getSquadContents(
      squadId,
      role as UserRole,
      userId
    );

    return SquadContentResponseDto.fromEntities(contents);
  }
}
