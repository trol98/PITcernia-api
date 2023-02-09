import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pizza } from './entities/pizza.entity';
import { Topping } from './entities/topping.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pizza, Topping])],
})
export class PizzaModule {}
