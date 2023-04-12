import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class PasswordResetDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
    { message: 'Weak password' },
  )
  password: string;
}
