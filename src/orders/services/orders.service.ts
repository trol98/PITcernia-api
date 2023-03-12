import { PizzaToOrder } from 'src/orders/entities/pizza_order.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from '../dto/CreateOrder.dto';
import { Order } from '../entities/order.entity';
import { PostgresErrorCode } from 'src/database/postgresErrorCode.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(PizzaToOrder)
    private pizzaToOrderRepository: Repository<PizzaToOrder>,
  ) {}

  async getOrders() {
    const q = this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.user', 'user')
      .leftJoinAndSelect('order.pizzaToOrder', 'pizzaToOrder')
      .leftJoinAndSelect('pizzaToOrder.pizza', 'pizza');
    return await q.getMany();
  }

  async getUserOrders(id: number) {
    const q = this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.user', 'user')
      .leftJoinAndSelect('order.pizzaToOrder', 'pizzaToOrder')
      .leftJoinAndSelect('pizzaToOrder.pizza', 'pizza')
      .where({ userId: id });
    return await q.getMany();
  }

  // userId comes from the JWT token that came coupled with the request
  async createOrder(userId: number, createOrder: CreateOrderDto) {
    const { shipping_address, pizzaId, quantity } = createOrder;
    const order = this.orderRepository.create({
      shipping_address,
      finished: false,
      canceled: false,
      userId,
    });
    await this.orderRepository.save(order);

    const pizzaToOrder = this.pizzaToOrderRepository.create({
      orderId: order.id,
      pizzaId,
      quantity,
    });
    try {
      await this.pizzaToOrderRepository.save(pizzaToOrder);
    } catch (error) {
      if (error?.code === PostgresErrorCode.ForeignKeyViolation) {
        throw new HttpException(
          'This pizza does not exist',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return order;
  }
}
