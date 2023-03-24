import { PizzaToOrder } from 'src/orders/entities/pizza_order.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
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

  async getUserOrders(id: number, isActive: boolean) {
    if (isActive) {
      // return active orders
      const q = this.orderRepository
        .createQueryBuilder('order')
        .leftJoin('order.user', 'user')
        .leftJoinAndSelect('order.pizzaToOrder', 'pizzaToOrder')
        .leftJoinAndSelect('pizzaToOrder.pizza', 'pizza')
        .andWhere({ userId: id })
        .andWhere({ finished: false })
        .andWhere({ canceled: false });
      return await q.getMany();
    } else {
      // return orders that were either canceled or finished
      const q = this.orderRepository
        .createQueryBuilder('order')
        .leftJoin('order.user', 'user')
        .leftJoinAndSelect('order.pizzaToOrder', 'pizzaToOrder')
        .leftJoinAndSelect('pizzaToOrder.pizza', 'pizza')
        .andWhere({ userId: id })
        .andWhere(
          new Brackets((sub) => {
            sub.andWhere({ finished: true }).orWhere({ canceled: true });
          }),
        );
      return await q.getMany();
    }
  }

  async createOrder(userId: number, createOrder: CreateOrderDto) {
    const { shipping_address, pizzaLines } = createOrder;

    // FIXME: If creating a PizzaToOrder fails,
    // do not create an empty order
    // Try doing it with transactions

    // const q = this.orderRepository.queryRunner;
    // q.startTransaction();s

    const order = this.orderRepository.create({
      shipping_address,
      finished: false,
      canceled: false,
      userId,
    });
    await this.orderRepository.save(order);

    try {
      for (const line of pizzaLines) {
        const pizzaToOrder = this.pizzaToOrderRepository.create({
          orderId: order.id,
          pizzaId: line.pizzaId,
          quantity: line.quantity,
        });
        await this.pizzaToOrderRepository.save(pizzaToOrder);
      }
      // q.commitTransaction();
    } catch (error) {
      // q.rollbackTransaction();
      if (error?.code === PostgresErrorCode.ForeignKeyViolation) {
        throw new HttpException(
          'At least one pizza does not exist',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    // finally {
    //   // q.release();
    //   return;
    // }
    return order;
  }

  async cancelOrder(id: number, userId: number) {
    let order: Order | null;
    try {
      order = await this.orderRepository.findOneBy({
        id,
        userId,
      });
    } catch (error) {
      throw new HttpException('Order does not exist', HttpStatus.NOT_FOUND);
    }
    if (order == null || order.finished) {
      throw new HttpException(
        'This order has already been finished',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      order.canceled = true;
      this.orderRepository.save(order);
    }
  }
}
