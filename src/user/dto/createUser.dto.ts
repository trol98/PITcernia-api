import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  hashed_password: string;

  @IsBoolean()
  active: boolean;

  @IsBoolean()
  verified: boolean;

  @IsBoolean()
  admin: boolean;
}
