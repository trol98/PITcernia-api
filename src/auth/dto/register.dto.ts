import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsBoolean()
  active: boolean;

  @IsBoolean()
  verified: boolean;

  @IsBoolean()
  admin: boolean;
}
