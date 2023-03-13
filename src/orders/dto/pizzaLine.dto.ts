import { IsNotEmpty, IsPositive, IsInt } from 'class-validator';

export class PizzaLine {
  @IsPositive()
  @IsNotEmpty()
  @IsInt()
  pizzaId: number;

  @IsPositive()
  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
