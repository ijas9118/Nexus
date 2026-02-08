import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

import type { ISquadAggregated } from "@/core/types/squad";

export class SquadListDto {
  @IsString()
  @IsNotEmpty()
  _id!: string;

  @IsString()
  logo!: string;

  @IsString()
  adminId!: string;

  @IsString()
  adminProfilePic!: string;

  @IsString()
  adminName!: string;

  @IsString()
  name!: string;

  @IsString()
  handle!: string;

  @IsString()
  category!: string;

  @IsNumber()
  membersCount!: number;

  @IsBoolean()
  isPremium!: boolean;

  @IsBoolean()
  isActive!: boolean;

  static fromEntity(entity: ISquadAggregated): SquadListDto {
    const dto = new SquadListDto();
    dto._id = entity._id;
    dto.logo = entity.logo;
    dto.adminId = entity.adminId?.toString();
    dto.adminProfilePic = entity.adminProfilePic;
    dto.adminName = entity.adminName;
    dto.name = entity.name;
    dto.handle = entity.handle;
    dto.category = entity.category;
    dto.membersCount = entity.membersCount;
    dto.isPremium = entity.isPremium;
    dto.isActive = entity.isActive;
    return dto;
  }

  static fromEntities(entities: ISquadAggregated[]): SquadListDto[] {
    return entities.map(entity => this.fromEntity(entity));
  }
}
