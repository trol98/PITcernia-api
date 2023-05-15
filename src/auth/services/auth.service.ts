import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from '../dto/register.dto';
import { UserService } from 'src/user/services/user.service';
import { PostgresErrorCode } from 'src/database/postgresErrorCode.enum';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EmailConfirmationService } from './../../emailConfirmation/emailConfirmation.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  public async register(registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);

    try {
      const createdUser = await this.userService.create({
        ...registrationData,
        hashed_password: hashedPassword,
      });
      createdUser.hashed_password = undefined;
      await this.emailConfirmationService.sendVerificationLink(
        createdUser.email,
      );
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
      // TODO: Maybe change error code?
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  public getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    const expiration = this.configService.get('JWT_EXPIRATION_TIME');
    return `Authentication=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${expiration}`;
  }
  public getCookieForLogOut() {
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
      // TODO: Maybe change error code?
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  private async verifyIsNotDeleted(user: User) {
    const isActive = user.active;
    // TODO: Maybe change error code?
    if (!isActive) {
      throw new HttpException('User deleted', HttpStatus.BAD_REQUEST);
    }
  }
}
