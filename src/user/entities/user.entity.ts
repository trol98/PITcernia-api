import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // add Orders relation

  @Column({ unique: true })
  login: string;

  @Column({ unique: true })
  email: string;

  @Column()
  hashed_password: string;

  @Column()
  active: boolean;

  @Column()
  verified: boolean;

  @Column()
  admin: boolean;
}
