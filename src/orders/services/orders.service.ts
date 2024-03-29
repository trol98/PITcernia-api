import { PizzaToOrder } from 'src/orders/entities/pizza_order.entity';
import { HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository } from 'typeorm';
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
    private dataSource: DataSource,
  ) {}

  async getOrders(isActive: boolean, before: Date, after: Date) {
    const params = {
      after: after.toISOString(),
      before: before.toISOString(),
    };

    if (isActive) {
      // return active orders
      const q = this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.user', 'user')
        .leftJoinAndSelect('order.pizzaToOrder', 'pizzaToOrder')
        .leftJoinAndSelect('pizzaToOrder.pizza', 'pizza')
        .andWhere({ finished: false })
        .andWhere({ canceled: false })
        .andWhere(`DATE_TRUNC('day', "order_date") >= :after`)
        .andWhere(`DATE_TRUNC('day', "order_date") <= :before`)
        .setParameters(params);
      return await q.getMany();
    } else {
      // return orders that were either canceled or finished
      const q = this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.user', 'user')
        .leftJoinAndSelect('order.pizzaToOrder', 'pizzaToOrder')
        .leftJoinAndSelect('pizzaToOrder.pizza', 'pizza')
        .andWhere(
          new Brackets((sub) => {
            sub.andWhere({ finished: true }).orWhere({ canceled: true });
          }),
        )
        .andWhere(`DATE_TRUNC('day', "order_date") >= :after`)
        .andWhere(`DATE_TRUNC('day', "order_date") <= :before`)
        .setParameters(params);
      return await q.getMany();
    }
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

    const q = this.dataSource.createQueryRunner();
    await q.startTransaction();
    const order = q.manager.create(Order, {
      shipping_address,
      finished: false,
      canceled: false,
      userId,
    });
    await q.manager.save(order);

    try {
      for (const line of pizzaLines) {
        const pizzaToOrder = q.manager.create(PizzaToOrder, {
          orderId: order.id,
          pizzaId: line.pizzaId,
          quantity: line.quantity,
        });
        await q.manager.save(pizzaToOrder);
      }
      await q.commitTransaction();
    } catch (error) {
      await q.rollbackTransaction();
      if (error?.code === PostgresErrorCode.ForeignKeyViolation) {
        throw new HttpException(
          'At least one pizza does not exist',
          HttpStatus.BAD_REQUEST,
        );
      }
    } finally {
      q.release();
    }
    return order;
  }

  async cancelOrder(id: number, userId: number) {
    const order = await this.orderRepository.findOneBy({
      id,
      userId,
    });

    if (order == null) {
      throw new HttpException('Order does not exist', HttpStatus.NOT_FOUND);
    } else if (order.finished) {
      throw new HttpException(
        'This order has already been finished',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      order.canceled = true;
      this.orderRepository.save(order);
    }

    return order;
  }

  async finishOrder(id: number) {
    const order = await this.orderRepository.findOneBy({
      id,
    });
    if (order == null) {
      throw new HttpException('Order does not exist', HttpStatus.NOT_FOUND);
    } else if (order.canceled) {
      throw new HttpException(
        'This order has already been canceled',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      order.finished = true;
      this.orderRepository.save(order);
    }
    return order;
  }

  async getOrder(id: number) {
    const q = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.pizzaToOrder', 'pizzaToOrder')
      .leftJoinAndSelect('pizzaToOrder.pizza', 'pizza')
      .andWhere({ id });
    try {
      return await q.getOneOrFail();
    } catch (error) {
      throw new HttpException('Order does not exist', HttpStatus.BAD_REQUEST);
    }
  }
}
