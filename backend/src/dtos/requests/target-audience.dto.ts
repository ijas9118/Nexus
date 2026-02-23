import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateTargetAudienceRequestDto {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  @MinLength(2, { message: "Name must be at least 2 characters long" })
  @MaxLength(50, { message: "Name must not exceed 50 characters" })
  name!: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  static fromPayload(payload: any): CreateTargetAudienceRequestDto {
    const dto = new CreateTargetAudienceRequestDto();
    dto.name = payload.name;
    if (payload.isActive !== undefined)
      dto.isActive = payload.isActive;
    return dto;
  }
}

export class UpdateTargetAudienceRequestDto {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  @MinLength(2, { message: "Name must be at least 2 characters long" })
  @MaxLength(50, { message: "Name must not exceed 50 characters" })
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  static fromPayload(payload: any): UpdateTargetAudienceRequestDto {
    const dto = new UpdateTargetAudienceRequestDto();
    if (payload.name !== undefined)
      dto.name = payload.name;
    if (payload.isActive !== undefined)
      dto.isActive = payload.isActive;
    return dto;
  }
}
