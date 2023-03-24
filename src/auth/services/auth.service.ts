import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostgresErrorCode } from 'src/database/postgresErrorCode.enum';
import { UserService } from 'src/user/services/user.service';
import { RegisterDto } from '../dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async register(registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);

    try {
      const createdUser = await this.userService.create({
        ...registrationData,
        hashed_password: hashedPassword,
      });
      createdUser.hashed_password = undefined;
      return createdUser;
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
  }
  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.userService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, user.hashed_password);
      // TODO: Check if this is the correct place to check for user
      // being active (user.service.ts maybe ?)
      await this.verifyIsNotDeleted(user);

      user.hashed_password = undefined;
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  public getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    // TODO: For production consider adding the Secure option and/or
    // additional security related options
    const expiration = this.configService.get('JWT_EXPIRATION_TIME');
    return `Authentication=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${expiration}`;
  }
  public getCookieForLogOut() {
    // TODO: For production consider adding the Secure option and/or
    // additional security related options
    return `Authentication=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`;
  }
  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  private async verifyIsNotDeleted(user: User) {
    const isActive = user.active;
    if (!isActive) {
      throw new HttpException('User deleted', HttpStatus.BAD_REQUEST);
    }
  }

  public async verifyEmail(id: number) {
    // return this.userService.verifyUser();
  }
}
