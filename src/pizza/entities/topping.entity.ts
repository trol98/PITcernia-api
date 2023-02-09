import { Pizza } from './pizza.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity()
export class Topping {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Pizza, (pizza: Pizza) => pizza.toppings)
  pizza: Pizza[];

  @Column()
  name: string;
}
