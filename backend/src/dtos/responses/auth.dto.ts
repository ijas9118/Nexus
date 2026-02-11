import { IsArray, IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";

import type { UserRole } from "@/core/types/user-types";
import type { IUser } from "@/models/user/user.model";

export class RegisterResponseDTO {
  @IsString()
  _id!: string;

  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  username!: string;

  @IsString()
  role!: UserRole;

  static fromEntity(entity: IUser): RegisterResponseDTO {
    const dto = new RegisterResponseDTO();
    dto._id = entity._id;
    dto.name = entity.name;
    dto.email = entity.email;
    dto.username = entity.username;
    dto.role = entity.role;
    return dto;
  }
}

export class LoginResponseDTO {
  @IsString()
  _id!: string;

  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  profilePic!: string;

  @IsArray()
  @IsString({ each: true })
  joinedSquads!: string[];

  @IsString()
  role!: UserRole;

  @IsString()
  username!: string;

  @IsBoolean()
  isPremium!: boolean;

  @IsOptional()
  @IsString()
  mentorId?: string;

  static fromEntity(entity: IUser & { mentorId?: string }): LoginResponseDTO {
    const dto = new LoginResponseDTO();
    dto._id = entity._id;
    dto.name = entity.name;
    dto.email = entity.email;
    dto.profilePic = entity.profilePic;
    dto.joinedSquads = entity.joinedSquads || [];
    dto.role = entity.role;
    dto.username = entity.username;
    dto.isPremium = entity.isPremium;
    dto.mentorId = entity.mentorId;
    return dto;
  }
}
