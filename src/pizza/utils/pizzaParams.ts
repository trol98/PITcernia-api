import { IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class PizzaParams {
  @Type(() => String)
  toppings: string[];

  @Type(() => String)
  sizes: string[];

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice: number;

  @Type(() => Number)
  @IsNumber()
  maxPrice: number;
}

export default PizzaParams;
