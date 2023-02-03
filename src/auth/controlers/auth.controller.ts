import { RegisterDto } from '../dto/register.dto';
import { AuthService } from '../services/auth.service';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthenticationGuard } from '../localAuthentication.guard';
import RequestWithUser from '../requestWithUser.interface';

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
  async logIn(@Req() request: RequestWithUser) {
    const user = request.user;
    user.hashed_password = undefined;
    return user;
  }
}
