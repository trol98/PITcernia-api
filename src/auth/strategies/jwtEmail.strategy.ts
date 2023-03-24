import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class JwtEmailStrategy extends PassportStrategy(Strategy, 'jwt-email') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      secretOrKey: configService.get('JWT_EMAIL_SECRET'),
    });
  }

  async validate(payload: TokenEmailPayload) {
    return this.userService.getByEmail(payload.email);
  }
}
