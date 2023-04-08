import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from 'src/orders/entities/order.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @Column({ unique: true })
  login: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: '' })
  shipping_address: string;

  @Column({ select: false })
  hashed_password: string;

  @Column()
  active: boolean;

  @Column()
  verified: boolean;

  @Column()
  admin: boolean;
}
