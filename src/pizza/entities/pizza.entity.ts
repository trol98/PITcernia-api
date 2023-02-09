import { Topping } from './topping.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { PizzaToOrder } from 'src/orders/entities/pizza_order.entity';

@Entity()
export class Pizza {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(
    () => PizzaToOrder,
    (orderToPizza: PizzaToOrder) => orderToPizza.pizza,
  )
  orderToPizza: PizzaToOrder[];

  @ManyToMany(() => Topping, (topping: Topping) => topping.pizza)
  toppings: Topping[];

  @Column()
  name: string;

  @Column()
  prize: number;

  @Column()
  size: string;
}
