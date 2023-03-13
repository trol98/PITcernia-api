import { AdminGuard } from './../auth/admin.guard';
import { OrdersService } from './services/orders.service';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './dto/CreateOrder.dto';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import RequestWithUser from 'src/auth/requestWithUser.interface';

@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @Post('create')
  @UseGuards(JwtAuthenticationGuard)
  createOrder(
    @Req() request: RequestWithUser,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.createOrder(request.user.id, createOrderDto);
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  getUserOrders(@Req() request: RequestWithUser) {
    return this.orderService.getUserOrders(request.user.id);
  }

  @Get('all')
  @UseGuards(JwtAuthenticationGuard, AdminGuard)
  getOrders() {
    return this.orderService.getOrders();
  }
}
