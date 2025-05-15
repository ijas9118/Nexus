import { UserRole } from '@/core/types/UserTypes';
import { IUser } from '@/models/user.model';
import { IsEmail, IsString } from 'class-validator';

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
