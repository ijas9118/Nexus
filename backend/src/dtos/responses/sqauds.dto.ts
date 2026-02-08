import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

import type { SquadWithIsJoined } from '@/core/types/squad';

export class SquadByCategoryResponseDto {
  @IsString()
  _id!: string;

  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsString()
  handle!: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  category!: string;

  @IsBoolean()
  isActive!: boolean;

  @IsBoolean()
  isPremium!: boolean;

  @IsBoolean()
  isJoined!: boolean;

  @IsNumber()
  membersCount!: number;

  static fromEntity(entity: SquadWithIsJoined): SquadByCategoryResponseDto {
    const dto = new SquadByCategoryResponseDto();
    dto._id = entity._id;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.handle = entity.handle;
    dto.logo = entity.logo;
    dto.category = entity.category;
    dto.isActive = entity.isActive;
    dto.isPremium = entity.isPremium;
    dto.isJoined = Boolean(entity.isJoined);
    dto.membersCount = entity.membersCount;
    return dto;
  }

  static fromEntities(entities: SquadWithIsJoined[]): SquadByCategoryResponseDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
