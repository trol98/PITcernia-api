import { Pizza } from 'src/pizza/entities/pizza.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { PizzaToOrder } from './pizza_order.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  // TODO: add user relation

  @OneToMany(
    () => PizzaToOrder,
    (pizzaToOrder: PizzaToOrder) => pizzaToOrder.order,
  )
  pizzaToOrder: PizzaToOrder[];

  @CreateDateColumn()
  order_date: Date;

  @Column()
  shipping_address: string;

  @Column()
  finished: boolean;

  @Column()
  canceled: boolean;
}
