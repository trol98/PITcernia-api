import { UserService } from 'src/user/services/user.service';
import { PasswordResetDto } from './utils/passwordReset.dto';
import { Body, Controller, Post } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PasswordForgotDto } from './utils/passwordForgot.dto';
import { PasswordResetService } from './passwordReset.service';

@Controller('reset')
export class PasswordResetController {
  constructor(
    private passwordResetService: PasswordResetService,
    private userService: UserService,
  ) {}
  @Post('send-email')
  sendEmail(@Body() passwordForgotDto: PasswordForgotDto) {
    return this.passwordResetService.sendEmail(passwordForgotDto.email);
  }

  @Post('password')
  async resetPassword(@Body() passwordResetDto: PasswordResetDto) {
    const { token, password } = passwordResetDto;
    const id = await this.passwordResetService.decodeResetToken(token);

    return await this.userService.updatePassword(id, password);
  }
}
