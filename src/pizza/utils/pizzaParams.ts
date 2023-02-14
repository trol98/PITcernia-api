import { IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class PizzaParams {
  @Type(() => String)
  toppings: string[];

  @Type(() => String)
  sizes: string[];

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrize: number;

  @Type(() => Number)
  @IsNumber()
  maxPrize: number;
}

export default PizzaParams;
