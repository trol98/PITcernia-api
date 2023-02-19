import { Pizza } from 'src/pizza/entities/pizza.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class PizzaToOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Order, (order: Order) => order.pizzaToOrder, {
    eager: true,
  })
  order: Order;

  @Column()
  orderId: number;

  @ManyToOne(() => Pizza, (pizza: Pizza) => pizza.orderToPizza, {
    eager: true,
  })
  pizza: Pizza;

  @Column()
  pizzaId: number;
}
