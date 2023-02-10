import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PizzaController } from './controllers/pizza.controller';
import { Pizza } from './entities/pizza.entity';
import { Topping } from './entities/topping.entity';
import { PizzaService } from './services/pizza.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pizza, Topping])],
  controllers: [PizzaController],
  providers: [PizzaService],
})
export class PizzaModule {}
