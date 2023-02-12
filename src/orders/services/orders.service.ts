import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from '../dto/CreateOrder.dto';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async getOrders() {
    return await this.orderRepository.find();
  }

  async createOrder(createOrder: CreateOrderDto) {
    // TODO: check for userId not matching the user id in the RequestWithUser
    const order = await this.orderRepository.create(createOrder);
    await this.orderRepository.save(order);
    return order;
  }
}
