import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { OrdersModule } from './orders/orders.module';
import { PizzaModule } from './pizza/pizza.module';
import { DatabaseModule } from './database/database.module';
import { ThrottlerModule } from '@nestjs/throttler';
// import { AppLoggerMiddleware } from './testLoggerMiddleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    DatabaseModule,
    OrdersModule,
    PizzaModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
  ],
})
export class AppModule {}

// uncomment this for request logging capabilities
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer): void {
//     consumer.apply(AppLoggerMiddleware).forRoutes('*');
//   }
// }
