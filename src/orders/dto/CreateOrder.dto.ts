import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  pizzaId: number;

  @IsString()
  @IsNotEmpty()
  shipping_address: string;

  @IsBoolean()
  @IsNotEmpty()
  finished: boolean;

  @IsBoolean()
  @IsNotEmpty()
  canceled: boolean;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}
