import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ToppingDto {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;
}
