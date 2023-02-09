import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { PizzaToOrder } from './entities/pizza_order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, PizzaToOrder])],
})
export class OrdersModule {}
