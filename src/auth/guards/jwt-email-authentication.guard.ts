import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class JwtEmailAuthenticationGuard extends AuthGuard(
  'jwt-email',
) {}
