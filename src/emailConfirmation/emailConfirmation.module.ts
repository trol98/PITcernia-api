import { EmailConfirmationController } from './emailConfirmation.controller';
import { UserModule } from './../user/user.module';
import { EmailConfirmationService } from './emailConfirmation.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [EmailConfirmationService],
  exports: [EmailConfirmationService],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
        signOptions: {
          expiresIn: `${configService.get(
            'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
          )}s`,
        },
      }),
    }),
    ConfigModule,
    UserModule,
  ],
  controllers: [EmailConfirmationController],
})
export class EmailConfirmationModule {}
