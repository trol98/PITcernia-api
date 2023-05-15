import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Raw, Repository } from 'typeorm';
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

  async getPizza(id: number) {
    const pizza = await this.pizzaRepository.findOne({
      where: {
        id,
      },
      relations: {
        toppings: true,
      },
    });
    return pizza;
  }

  async searchPizzas(
    toppingsNames: string[],
    sizes: string[],
    minPrice: number,
    maxPrice: number,
  ) {
    const pizza = await this.pizzaRepository.find({
      where: {
        price: Between(minPrice, maxPrice),

        // if no sizes were given, don't filter by size
        size: sizes ? In(sizes) : Raw('size'),
        // FIXME: Look into dealing with this with ArrayContainedBy or with Raw operators
        // if this doesn't work look into the possibility of using QueryBuilder
        // Raw Postgres queries
        // https://www.postgresql.org/docs/current/functions-array.html#ARRAY-OPERATORS-TABLE
        // https://stackoverflow.com/questions/11231544/check-if-value-exists-in-postgres-array
        // https://github.com/typeorm/typeorm/blob/master/docs/find-options.md
      },
      relations: {
        toppings: true,
      },
    });

    // FIXME: This is a work around becouse for now I'm unable to
    // filter the pizza by queries to the db
    if (!toppingsNames) return pizza;

    return pizza.filter((pizza) => {
      const names = pizza.toppings.map((topping) => topping.name);
      return toppingsNames.every((name) => names.includes(name));
    });
  }
}
