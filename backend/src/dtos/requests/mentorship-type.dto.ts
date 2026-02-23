import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";

// Request DTO for creating a mentorship type
export class CreateMentorshipTypeRequestDto {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  @MinLength(3, { message: "Name must be at least 3 characters long" })
  @MaxLength(50, { message: "Name must not exceed 50 characters" })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: "Description is required" })
  @MinLength(10, { message: "Description must be at least 10 characters long" })
  @MaxLength(500, { message: "Description must not exceed 500 characters" })
  description!: string;

  @IsNumber()
  @Min(0, { message: "Price cannot be negative" })
  @IsOptional()
  defaultPrice?: number;

  static fromPayload(payload: {
    name: string;
    description: string;
    defaultPrice: number | undefined;
  }): CreateMentorshipTypeRequestDto {
    const dto = new CreateMentorshipTypeRequestDto();
    dto.name = payload.name;
    dto.description = payload.description;
    if (payload.defaultPrice !== undefined)
      dto.defaultPrice = Number(payload.defaultPrice);
    return dto;
  }
}

interface UpdateMentorshipTypePayload {
  name?: string;
  description?: string;
  defaultPrice?: number;
}

// Request DTO for updating a mentorship type
export class UpdateMentorshipTypeRequestDto {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  @MinLength(3, { message: "Name must be at least 3 characters long" })
  @MaxLength(50, { message: "Name must not exceed 50 characters" })
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty({ message: "Description is required" })
  @MinLength(10, { message: "Description must be at least 10 characters long" })
  @MaxLength(500, { message: "Description must not exceed 500 characters" })
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0, { message: "Price cannot be negative" })
  @IsOptional()
  defaultPrice?: number;

  static fromPayload(payload: UpdateMentorshipTypePayload): UpdateMentorshipTypeRequestDto {
    const dto = new UpdateMentorshipTypeRequestDto();
    if (payload.name !== undefined)
      dto.name = payload.name;
    if (payload.description !== undefined)
      dto.description = payload.description;
    if (payload.defaultPrice !== undefined)
      dto.defaultPrice = Number(payload.defaultPrice);
    return dto;
  }
}
