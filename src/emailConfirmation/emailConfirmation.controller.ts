import {
  Controller,
  ClassSerializerInterceptor,
  UseInterceptors,
  Post,
  Body,
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

  //   @Post('resend-confirmation-link')
  //   @UseGuards(JwtAuthenticationGuard)
  //   async resendConfirmationLink(@Req() request: RequestWithUser) {
  //     await this.emailConfirmationService.resendConfirmationLink(request.user.id);
  //   }
}
