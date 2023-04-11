import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/services/user.service';
import EmailService from 'src/email/email.service';
import ResetTokenPayload from './utils/resetTokenPayload.interface';

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly usersService: UserService,
  ) {}

  async sendEmail(email: string) {
    const user = await this.usersService.getByEmail(email);
    user.hashed_password = undefined;
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }
    const payload: ResetTokenPayload = { id: user.id };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_RESET_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_RESET_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    const resetLink = `${this.configService.get(
      'EMAIL_PASSWORD_RESET_URL',
    )}?token=${token}`;

    await this.emailService.sendMail({
      to: email,
      subject: 'Forgot Password',
      html: `
                  <h3>Hello ${user.login}!</h3>
                  <h5>Please use this <a href="${resetLink}">link</a> to reset your password.</h5>
                  <p>If you didn't issues this password reset, you can safely ignore this message.</p>
              `,
    });
    console.log(resetLink);
    return user;
  }
}
