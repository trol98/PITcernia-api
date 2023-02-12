import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { PizzaToOrder } from './entities/pizza_order.entity';
import { OrdersService } from './services/orders.service';
import { OrdersController } from './orders.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Order, PizzaToOrder])],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
