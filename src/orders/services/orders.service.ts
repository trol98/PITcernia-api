import { PizzaToOrder } from 'src/orders/entities/pizza_order.entity';
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
    @InjectRepository(PizzaToOrder)
    private pizzaToOrderRepository: Repository<PizzaToOrder>,
  ) {}

  async getOrders() {
    return await this.orderRepository.find();
  }

  // userId comes from the JWT token that came coupled with the request
  async createOrder(userId: number, createOrder: CreateOrderDto) {
    const { shipping_address, finished, canceled, pizzaId, quantity } =
      createOrder;
    const order = this.orderRepository.create({
      shipping_address,
      finished,
      canceled,
      userId,
    });
    await this.orderRepository.save(order);

    const pizzaToOrder = this.pizzaToOrderRepository.create({
      orderId: order.id,
      pizzaId,
      quantity,
    });
    await this.pizzaToOrderRepository.save(pizzaToOrder);

    return order;
  }
}
