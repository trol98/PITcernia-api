import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UserUpdateDto {
  @IsString()
  @IsOptional()
  @Type(() => String)
  newLogin: string;
  @IsString()
  @IsOptional()
  @Type(() => String)
  newEmail: string;
}
