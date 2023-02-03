import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controlers/auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';

@Module({
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
  imports: [UserModule, PassportModule],
})
export class AuthModule {}
