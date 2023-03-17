import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostgresErrorCode } from 'src/database/postgresErrorCode.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
    const user = await this.usersRepository.findOneBy({ email });
    // const user = await this.usersRepository.findOne({
    //   where: {
    //     email,
    //     active: true,
    //   },
    // });

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
}
