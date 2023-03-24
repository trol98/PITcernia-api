import { RegisterDto } from '../dto/register.dto';
import { AuthService } from '../services/auth.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthenticationGuard } from '../guards/localAuthentication.guard';
import RequestWithUser from '../dto/requestWithUser.interface';
import { Response } from 'express';
import JwtAuthenticationGuard from '../guards/jwt-authentication.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authenticationService: AuthService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;

    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);

    user.hashed_password = undefined;
    return response.send(user);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Res() response: Response) {
    response.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    user.hashed_password = undefined;
    return user;
  }

  @Post('verify')
  async verify(@Req() request: RequestWithUser) {
    const { user } = request;
    return this.authenticationService.verifyEmail(user.id);
  }
}
