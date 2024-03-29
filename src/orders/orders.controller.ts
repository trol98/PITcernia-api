import { AdminGuard } from '../auth/guards/admin.guard';
import { OrdersService } from './services/orders.service';
import { CreateOrderDto } from './dto/CreateOrder.dto';
import OrderParams from './utils/orderParams';
import RequestWithUser from 'src/auth/dto/requestWithUser.interface';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-authentication.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import OrderWithDateParams from './utils/orderWithDateParams';

@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @Post('create')
  @UseGuards(JwtAuthenticationGuard)
  createOrder(
    @Req() request: RequestWithUser,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const { user } = request;
    return this.orderService.createOrder(user.id, createOrderDto);
  }

  @Get('details/:id')
  @UseGuards(JwtAuthenticationGuard, AdminGuard)
  getOrder(@Param('id') id: number) {
    return this.orderService.getOrder(id);
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  getUserOrders(
    @Req() request: RequestWithUser,
    @Query() { isActive }: OrderParams,
  ) {
    const { user } = request;
    return this.orderService.getUserOrders(user.id, isActive);
  }

  @Get('all')
  @UseGuards(JwtAuthenticationGuard, AdminGuard)
  getOrders(@Query() { isActive, before, after }: OrderWithDateParams) {
    return this.orderService.getOrders(isActive, before, after);
  }

  @Put('cancel/:id')
  @UseGuards(JwtAuthenticationGuard)
  cancelOrder(@Param('id') id: number, @Req() request: RequestWithUser) {
    const { user } = request;
    return this.orderService.cancelOrder(id, user.id);
  }

  @Put('finish/:id')
  @UseGuards(JwtAuthenticationGuard, AdminGuard)
  finishOrder(@Param('id') id: number) {
    return this.orderService.finishOrder(id);
  }
}
