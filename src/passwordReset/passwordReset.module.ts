import { Module } from '@nestjs/common';
import { PasswordResetController } from './passwordReset.controller';
import { PasswordResetService } from './passwordReset.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from 'src/email/email.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [PasswordResetController],
  providers: [PasswordResetService],
  exports: [PasswordResetService],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_RESET_TOKEN_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_RESET_TOKEN_EXPIRATION_TIME')}s`,
        },
      }),
    }),
    ConfigModule,
    EmailModule,
    UserModule,
  ],
})
export class PasswordResetModule {}
