import { Topping } from './topping.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { PizzaToOrder } from 'src/orders/entities/pizza_order.entity';

@Entity()
export class Pizza {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(
    () => PizzaToOrder,
    (orderToPizza: PizzaToOrder) => orderToPizza.pizza,
  )
  orderToPizza: PizzaToOrder[];

  @ManyToMany(() => Topping, (topping: Topping) => topping.pizza)
  @JoinTable()
  toppings: Topping[];

  @Column()
  name: string;

  // {
  //   type: 'decimal',
  //   precision: 10,
  //   scale: 2,
  //   default: 0.0,
  //   transformer: new ColumnNumericTransformer(),
  // }
  @Column()
  price: number;

  @Column()
  size: string;

  @Column()
  img_path: string;

  @Column()
  description: string;
}
