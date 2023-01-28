import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  getHello(): string {
    // To be removed
    // Just an example on how to use configService
    return 'Hello World on: ' + this.configService.get('PORT');
  }
}
