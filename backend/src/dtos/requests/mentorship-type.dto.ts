import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

// Request DTO for creating a mentorship type
export class CreateMentorshipTypeRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description!: string;

  @IsNumber()
  @Min(0, { message: 'Price cannot be negative' })
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
    if (payload.defaultPrice !== undefined) dto.defaultPrice = Number(payload.defaultPrice);
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
  @IsNotEmpty({ message: 'Name is required' })
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0, { message: 'Price cannot be negative' })
  @IsOptional()
  defaultPrice?: number;

  static fromPayload(payload: UpdateMentorshipTypePayload): UpdateMentorshipTypeRequestDto {
    const dto = new UpdateMentorshipTypeRequestDto();
    if (payload.name !== undefined) dto.name = payload.name;
    if (payload.description !== undefined) dto.description = payload.description;
    if (payload.defaultPrice !== undefined) dto.defaultPrice = Number(payload.defaultPrice);
    return dto;
  }
}
