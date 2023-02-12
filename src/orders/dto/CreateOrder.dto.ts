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
  userId: number;

  @IsString()
  @IsNotEmpty()
  shipping_address: string;

  @IsBoolean()
  @IsNotEmpty()
  finished: boolean;

  @IsBoolean()
  @IsNotEmpty()
  canceled: boolean;
}
