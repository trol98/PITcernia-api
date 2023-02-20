import { AdminGuard } from './../auth/admin.guard';
import { OrdersService } from './services/orders.service';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './dto/CreateOrder.dto';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import RequestWithUser from 'src/auth/requestWithUser.interface';

@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  // TODO: Check for creating orders with canceled, finished set by regular users
  @Post('create')
  @UseGuards(JwtAuthenticationGuard)
  createOrder(
    @Req() request: RequestWithUser,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.createOrder(request.user.id, createOrderDto);
  }

  // TODO: Create second get route that return only orders belonging to the given user

  @Get()
  @UseGuards(JwtAuthenticationGuard, AdminGuard)
  getOrders() {
    return this.orderService.getOrders();
  }
}
