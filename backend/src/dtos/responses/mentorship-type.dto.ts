import { IsNumber, IsOptional, IsString } from "class-validator";

import type { IMentorshipType } from "@/models/mentorship-type.model";

export class MentorshipTypeResponseDto {
  @IsString()
  _id!: string;

  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsNumber()
  @IsOptional()
  defaultPrice?: number;

  isActive!: boolean;

  static fromEntity(entity: IMentorshipType): MentorshipTypeResponseDto {
    const dto = new MentorshipTypeResponseDto();
    dto._id = entity._id;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.defaultPrice = entity.defaultPrice;
    dto.isActive = entity.isActive;
    return dto;
  }

  static fromEntities(entities: IMentorshipType[]): MentorshipTypeResponseDto[] {
    return entities.map(entity => this.fromEntity(entity));
  }
}
