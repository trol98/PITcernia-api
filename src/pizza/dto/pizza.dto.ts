import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ToppingDto } from './topping.dto';

export class PizzaDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  toppings: ToppingDto[];

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  prize: number;

  @IsString()
  @IsNotEmpty()
  size: string;

  @IsString()
  @IsNotEmpty()
  img_path: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
