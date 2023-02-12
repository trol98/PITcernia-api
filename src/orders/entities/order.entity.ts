import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { PizzaToOrder } from './pizza_order.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column()
  userId: number;

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
