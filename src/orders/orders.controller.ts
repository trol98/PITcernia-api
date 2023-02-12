import { OrdersService } from './services/orders.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/CreateOrder.dto';

@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  // TODO: Add auth guard here, so use has to be authenticated in order to create an offer
  @Post('create')
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get()
  getOrders() {
    return this.orderService.getOrders();
  }
}
