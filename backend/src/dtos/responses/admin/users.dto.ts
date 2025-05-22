import { IUser } from '@/models/user.model';
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UsersResponseDTO {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  profilePic!: string;

  @IsNotEmpty()
  @IsNumber()
  postsCount!: number;

  @IsNotEmpty()
  @IsNumber()
  joinedSquadsCount!: number;

  @IsNotEmpty()
  @IsBoolean()
  isBlocked!: boolean;

  static fromEntity(entity: IUser): UsersResponseDTO {
    const dto = new UsersResponseDTO();
    dto.id = entity._id;
    dto.email = entity.email;
    dto.name = entity.name;
    dto.profilePic = entity.profilePic;
    dto.postsCount = entity.postsCount;
    dto.joinedSquadsCount = entity.joinedSquads.length;
    dto.isBlocked = entity.isBlocked;

    return dto;
  }

  static fromEntities(entities: IUser[]): UsersResponseDTO[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
