import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/createUser.dto';
import { OrdersService } from './../../orders/services/orders.service';
import { InjectRepository } from '@nestjs/typeorm';
import { PostgresErrorCode } from 'src/database/postgresErrorCode.enum';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private orderSerice: OrdersService,
  ) {}
  async create(userData: CreateUserDto) {
    const newUser = this.usersRepository.create({
      ...userData,
      active: true,
      verified: false,
      admin: false,
    });
    await this.usersRepository.save(newUser);
    return newUser;
  }
  async getByEmail(email: string) {
    const q = this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.login',
        'user.email',
        'user.shipping_address',
        'user.hashed_password',
        'user.active',
        'user.verified',
        'user.admin',
      ])
      .where({ email, active: true });
    const user = await q.getOne();

    if (user) {
      return user;
    }
    // TODO: Change the response to something more generic so
    //  it's harder to scan for emails
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getByLogin(login: string) {
    // TODO: Think about converting to queryBuilder
    // to include hashed_password in the output
    const user = await this.usersRepository.findOneBy({ login });
    if (user) {
      return user;
    }
    // TODO: Change the response to something more generic so
    //  it's harder to scan for emails
    throw new HttpException(
      'User with this login does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getByID(id: number) {
    // TODO: Think about converting to queryBuilder
    // to include hashed_password in the output
    const user = await this.usersRepository.findOneBy({ id });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async updateUser(
    id: number,
    newLogin: string | null,
    newEmail: string | null,
    shipping_address: string | null,
  ) {
    const user = await this.usersRepository.findOneBy({ id });
    // FIXME: delete this check, if the token is valid, the id should be valid
    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      if (newLogin) {
        user.login = newLogin;
      }
      if (newEmail) {
        user.email = newEmail;
      }
      if (shipping_address) {
        user.shipping_address = shipping_address;
      }
      this.usersRepository.save(user);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that login or email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    user.hashed_password = undefined;
    return user;
  }

  async deleteUser(id: number) {
    const user = await this.usersRepository.findOneBy({ id });

    // FIXME: delete this check, if the token is valid, the id should be valid
    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const userOrders = await this.orderSerice.getUserOrders(user.id, true);

    if (userOrders.length > 0) {
      throw new HttpException(
        'User with this id does have active orders',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      user.active = false;
      this.usersRepository.save(user);

      user.hashed_password = undefined;
      return user;
    }
  }

  markEmailAsConfirmed(email: string) {
    return this.usersRepository.update(
      { email },
      {
        verified: true,
      },
    );
  }

  async updatePassword(id: number, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersRepository.findOneBy({ id });
    if (!user.active) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    this.usersRepository.update(
      { id },
      {
        hashed_password: hashedPassword,
      },
    );
    return true;
  }

  async changePassword(id: number, old_password: string, password: string) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.hashed_password', 'user.active'])
      .where({ id })
      .getOne();
    if (!user.active) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newHashedPassword = await bcrypt.hash(password, 10);
    const match = await bcrypt.compare(old_password, user.hashed_password);
    if (!match) {
      throw new HttpException('Incorrect password', HttpStatus.BAD_REQUEST);
    }
    this.usersRepository.update(
      { id },
      {
        hashed_password: newHashedPassword,
      },
    );
    return true;
  }
}
