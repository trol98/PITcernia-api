import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class PasswordChangeDto {
  @IsString()
  @IsNotEmpty()
  old_password: string;
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
    { message: 'Weak password' },
  )
  password: string;
}
