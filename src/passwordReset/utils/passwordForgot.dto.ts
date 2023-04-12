import { IsEmail, IsNotEmpty } from 'class-validator';

export class PasswordForgotDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
