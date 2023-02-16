import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContainedBy, Between, In, Repository } from 'typeorm';
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

  async searchPizzas(
    toppings: string[],
    sizes: string[],
    minPrize: number,
    maxPrize: number,
  ) {
    const pizza = await this.pizzaRepository.find({
      where: {
        price: Between(minPrize, maxPrize),
        size: In(sizes),
        toppings: {
          // TODO: Filtering by toppings, isn't working for now
          // Look into dealing with this with ArrayContainedBy or with Raw operators
          // if this doesn't work look into the possibility of using QuaryBuilder
          // Raw Postgres queries
          // or o it manually on the backend with Typescript
          // https://www.postgresql.org/docs/current/functions-array.html#ARRAY-OPERATORS-TABLE
          // https://stackoverflow.com/questions/11231544/check-if-value-exists-in-postgres-array
          // https://github.com/typeorm/typeorm/blob/master/docs/find-options.md

          name: In(toppings),
        },
      },
      relations: {
        toppings: true,
      },
    });
    return pizza;
  }
}
