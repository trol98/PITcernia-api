import { IsNumber, Min, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

class PizzaParams {
  @Type(() => String)
  @ArrayMinSize(1)
  toppings: string[];

  @Type(() => String)
  @ArrayMinSize(1)
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
