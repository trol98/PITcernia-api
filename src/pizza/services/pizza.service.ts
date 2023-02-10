import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pizza } from '../entities/pizza.entity';
import { Topping } from '../entities/topping.entity';

@Injectable()
export class PizzaService {
  constructor(
    @InjectRepository(Pizza)
    private pizzaRepository: Repository<Pizza>,
    @InjectRepository(Topping)
    private toppingRepository: Repository<Topping>,
  ) {}
  async getToppings() {
    const toppings = await this.toppingRepository.find();
    return toppings;
  }
  async getPizzas() {
    const pizza = await this.pizzaRepository.find({
      relations: {
        toppings: true,
      },
    });
    return pizza;
  }
}
