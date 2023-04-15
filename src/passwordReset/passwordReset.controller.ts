import { UserService } from 'src/user/services/user.service';
import { PasswordResetDto } from './utils/passwordReset.dto';
import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { PasswordForgotDto } from './utils/passwordForgot.dto';
import { PasswordResetService } from './passwordReset.service';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-authentication.guard';
import RequestWithUser from 'src/auth/dto/requestWithUser.interface';
import { PasswordChangeDto } from './utils/passwordChange.dto';

@Controller('password')
export class PasswordResetController {
  constructor(
    private passwordResetService: PasswordResetService,
    private userService: UserService,
  ) {}
  @Post('send-email')
  sendEmail(@Body() passwordForgotDto: PasswordForgotDto) {
    return this.passwordResetService.sendEmail(passwordForgotDto.email);
  }

  @Post('reset')
  async resetPassword(@Body() passwordResetDto: PasswordResetDto) {
    const { token, password } = passwordResetDto;
    const id = await this.passwordResetService.decodeResetToken(token);

    return await this.userService.updatePassword(id, password);
  }

  @Put('change')
  @UseGuards(JwtAuthenticationGuard)
  async changePassword(
    @Req() request: RequestWithUser,
    @Body() passwordChangeDto: PasswordChangeDto,
  ) {
    const { old_password, password } = passwordChangeDto;
    const { user } = request;
    // TODO: Add checking against old_password
    return await this.userService.changePassword(
      user.id,
      old_password,
      password,
    );
  }
}
