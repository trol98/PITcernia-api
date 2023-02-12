import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreatePizzaToOrderDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  orderId: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  pizzaId: number;
}
