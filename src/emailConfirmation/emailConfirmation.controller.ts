import {
  Controller,
  ClassSerializerInterceptor,
  UseInterceptors,
  Post,
  Query,
} from '@nestjs/common';
import ConfirmEmailDto from './confirmEmail.dto';
import { EmailConfirmationService } from './emailConfirmation.service';

@Controller('email-confirmation')
@UseInterceptors(ClassSerializerInterceptor)
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post('confirm')
  async confirm(@Query() { token }: ConfirmEmailDto) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      token,
    );
    await this.emailConfirmationService.confirmEmail(email);
  }
}
