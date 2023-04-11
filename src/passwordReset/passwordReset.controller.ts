import {
  Body,
  Controller,
  NotImplementedException,
  Post,
} from '@nestjs/common';
import { PasswordResetDto } from './utils/passwordReset.dto';
import { PasswordResetService } from './passwordReset.service';

@Controller('reset')
export class PasswordResetController {
  constructor(private passwordResetService: PasswordResetService) {}
  @Post('sendEmail')
  sendEmail(@Body() passwordResetDto: PasswordResetDto) {
    return this.passwordResetService.sendEmail(passwordResetDto.email);
  }

  @Post('password')
  resetPassword(@Body() passwordResetDto: PasswordResetDto) {
    throw new NotImplementedException();
  }
}
