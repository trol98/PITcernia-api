import { Controller, Get, Param, Query } from '@nestjs/common';
import { PizzaDto } from '../dto/pizza.dto';
import { ToppingDto } from '../dto/topping.dto';
import { PizzaService } from '../services/pizza.service';
import PizzaParams from '../utils/pizzaParams';

@Controller('pizza')
export class PizzaController {
  constructor(private pizzaService: PizzaService) {}

  @Get('/toppings')
  async getToppings(): Promise<ToppingDto[]> {
    return await this.pizzaService.getToppings();
  }

  @Get('/search')
  async searchPizzas(
    @Query() { toppings, sizes, minPrice, maxPrice }: PizzaParams,
  ): Promise<PizzaDto[]> {
    return await this.pizzaService.searchPizzas(
      toppings,
      sizes,
      minPrice,
      maxPrice,
    );
  }

  @Get('/')
  async getPizzas(): Promise<PizzaDto[]> {
    return await this.pizzaService.getPizzas();
  }

  @Get('/:id')
  async getPizza(@Param('id') id: number): Promise<PizzaDto> {
    return await this.pizzaService.getPizza(id);
  }
}
