import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ToppingDto } from './topping.dto';

export class PizzaDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  toppings: ToppingDto[];

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

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
