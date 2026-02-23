import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export enum MentorMetadataType {
  ExperienceLevel = "experienceLevel",
  ExpertiseArea = "expertiseArea",
  Technology = "technology",
}

export class CreateMentorMetadataRequestDto {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  @MinLength(2, { message: "Name must be at least 2 characters long" })
  @MaxLength(50, { message: "Name must not exceed 50 characters" })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: "Label is required" })
  @MinLength(2, { message: "Label must be at least 2 characters long" })
  @MaxLength(50, { message: "Label must not exceed 50 characters" })
  label!: string;

  @IsEnum(MentorMetadataType, { message: "Invalid metadata type" })
  @IsNotEmpty({ message: "Type is required" })
  type!: MentorMetadataType;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  static fromPayload(payload: any): CreateMentorMetadataRequestDto {
    const dto = new CreateMentorMetadataRequestDto();
    dto.name = payload.name;
    dto.label = payload.label;
    dto.type = payload.type;
    if (payload.isActive !== undefined)
      dto.isActive = payload.isActive;
    return dto;
  }
}

export class UpdateMentorMetadataRequestDto {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  @MinLength(2, { message: "Name must be at least 2 characters long" })
  @MaxLength(50, { message: "Name must not exceed 50 characters" })
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty({ message: "Label is required" })
  @MinLength(2, { message: "Label must be at least 2 characters long" })
  @MaxLength(50, { message: "Label must not exceed 50 characters" })
  @IsOptional()
  label?: string;

  @IsEnum(MentorMetadataType, { message: "Invalid metadata type" })
  @IsOptional()
  type?: MentorMetadataType;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  static fromPayload(payload: any): UpdateMentorMetadataRequestDto {
    const dto = new UpdateMentorMetadataRequestDto();
    if (payload.name !== undefined)
      dto.name = payload.name;
    if (payload.label !== undefined)
      dto.label = payload.label;
    if (payload.type !== undefined)
      dto.type = payload.type;
    if (payload.isActive !== undefined)
      dto.isActive = payload.isActive;
    return dto;
  }
}
