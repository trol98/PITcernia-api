import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import EmailService from './email.service';

@Module({
  providers: [EmailService],
  imports: [ConfigModule],
  exports: [EmailService],
})
export class EmailModule {}
