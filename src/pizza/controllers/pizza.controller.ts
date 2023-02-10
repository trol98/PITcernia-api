import { Controller, Get } from '@nestjs/common';
import { ToppingDto } from '../dto/topping.dto';
import { PizzaService } from '../services/pizza.service';

@Controller('pizza')
export class PizzaController {
  constructor(private pizzaService: PizzaService) {}
  @Get('/toppings')
  async getToppings(): Promise<ToppingDto[]> {
    return await this.pizzaService.getToppings();
  }
}
