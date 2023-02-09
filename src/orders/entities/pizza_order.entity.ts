import { Pizza } from 'src/pizza/entities/pizza.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class PizzaToOrder {
  @PrimaryGeneratedColumn()
  id: number;

  // TODO: add user relation

  @Column()
  quantity: number;

  @ManyToOne(() => Order, (order: Order) => order.pizzaToOrder)
  order: Order;

  @ManyToOne(() => Pizza, (pizza: Pizza) => pizza.orderToPizza)
  pizza: Pizza;
}
