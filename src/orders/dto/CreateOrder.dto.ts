import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsInt,
} from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @IsInt()
  pizzaId: number;

  @IsString()
  @IsNotEmpty()
  shipping_address: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
