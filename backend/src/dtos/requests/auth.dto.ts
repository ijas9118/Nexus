import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export class RegisterRequestDTO {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;

  static fromPayload(payload: RegisterPayload): RegisterRequestDTO {
    const dto = new RegisterRequestDTO();
    dto.name = payload.name;
    dto.email = payload.email;
    dto.password = payload.password;
    return dto;
  }
}

interface LoginPayload {
  email: string;
  password: string;
}

export class LoginRequestDTO {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  static fromPayload(payload: LoginPayload): LoginRequestDTO {
    const dto = new LoginRequestDTO();
    dto.email = payload.email;
    dto.password = payload.password;
    return dto;
  }
}
