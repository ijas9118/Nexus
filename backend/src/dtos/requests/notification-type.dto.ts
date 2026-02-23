import { ArrayMinSize, IsArray, IsBoolean, IsEnum, IsHexColor, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export enum NotificationRole {
  Mentor = "mentor",
  User = "user",
  Premium = "premium",
  Admin = "admin",
}

export class CreateNotificationTypeRequestDto {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  @MinLength(2, { message: "Name must be at least 2 characters long" })
  @MaxLength(50, { message: "Name must not exceed 50 characters" })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: "Description is required" })
  @MinLength(10, { message: "Description must be at least 10 characters long" })
  @MaxLength(500, { message: "Description must not exceed 500 characters" })
  description!: string;

  @IsString()
  @IsNotEmpty({ message: "Icon is required" })
  icon!: string;

  @IsHexColor({ message: "Invalid hex color for icon color" })
  @IsNotEmpty({ message: "Icon color is required" })
  iconColor!: string;

  @IsArray()
  @ArrayMinSize(1, { message: "At least one role is required" })
  @IsEnum(NotificationRole, { each: true, message: "Invalid role provided" })
  roles!: NotificationRole[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  static fromPayload(payload: any): CreateNotificationTypeRequestDto {
    const dto = new CreateNotificationTypeRequestDto();
    dto.name = payload.name;
    dto.description = payload.description;
    dto.icon = payload.icon;
    dto.iconColor = payload.iconColor;
    dto.roles = payload.roles;
    if (payload.isActive !== undefined)
      dto.isActive = payload.isActive;
    return dto;
  }
}

export class UpdateNotificationTypeRequestDto {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  @MinLength(2, { message: "Name must be at least 2 characters long" })
  @MaxLength(50, { message: "Name must not exceed 50 characters" })
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty({ message: "Description is required" })
  @MinLength(10, { message: "Description must be at least 10 characters long" })
  @MaxLength(500, { message: "Description must not exceed 500 characters" })
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty({ message: "Icon is required" })
  @IsOptional()
  icon?: string;

  @IsHexColor({ message: "Invalid hex color for icon color" })
  @IsNotEmpty({ message: "Icon color is required" })
  @IsOptional()
  iconColor?: string;

  @IsArray()
  @ArrayMinSize(1, { message: "At least one role is required" })
  @IsEnum(NotificationRole, { each: true, message: "Invalid role provided" })
  @IsOptional()
  roles?: NotificationRole[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  static fromPayload(payload: any): UpdateNotificationTypeRequestDto {
    const dto = new UpdateNotificationTypeRequestDto();
    if (payload.name !== undefined)
      dto.name = payload.name;
    if (payload.description !== undefined)
      dto.description = payload.description;
    if (payload.icon !== undefined)
      dto.icon = payload.icon;
    if (payload.iconColor !== undefined)
      dto.iconColor = payload.iconColor;
    if (payload.roles !== undefined)
      dto.roles = payload.roles;
    if (payload.isActive !== undefined)
      dto.isActive = payload.isActive;
    return dto;
  }
}
