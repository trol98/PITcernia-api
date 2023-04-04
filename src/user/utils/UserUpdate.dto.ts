import { Type } from 'class-transformer';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UserUpdateDto {
  @IsString()
  @IsOptional()
  @MinLength(1)
  @Type(() => String)
  newLogin: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  @Type(() => String)
  newEmail: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  shipping_address: string;
}
