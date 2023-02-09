import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
// import { AppLoggerMiddleware } from './testLoggerMiddleware';
import { OrdersModule } from './orders/orders.module';
import { PizzaModule } from './pizza/pizza.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UserModule, DatabaseModule, OrdersModule, PizzaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// uncomment this for request logging capabilities
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer): void {
//     consumer.apply(AppLoggerMiddleware).forRoutes('*');
//   }
// }
