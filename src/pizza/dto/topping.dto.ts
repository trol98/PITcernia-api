import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ToppingDto {
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;
}
