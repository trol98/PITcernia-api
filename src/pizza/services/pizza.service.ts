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
    // .where((qb) => {
    //   const subQuery = qb
    //     .subQuery()
    //     .select('topping.name')
    //     .from(Topping, 'topping')
    //     // .where('user.registered = :registered')
    //     .getQuery();
    //   return subQuery + ' <@  (:...toppings)';
    // })
    // .setParameter('toppings', toppings)
    // const toppingQuery = this.toppingRepository
    //   .createQueryBuilder('topping')
    //   .select('topping.name')
    //   .leftJoin('topping.pizza', 'pizza')
    //   .where('pizza.id = "pizza"."id"', { pizzaId: 1 });

    // const pizza2 = await this.pizzaRepository
    //   .createQueryBuilder('pizza')
    //   .select('pizza.id')
    //   .leftJoin('pizza.toppings', 'toppings')
    // .andWhere('pizza.price BETWEEN :minPrice AND :maxPrice', {
    //   minPrice,
    //   maxPrice,
    // })
    // .andWhere('pizza.size IN (:...sizes)', { sizes })
    // .where(
    //   'array(' + toppingQuery.getQuery() + ')::text[] <@ ARRAY[:...toppings]',
    //   {
    //     toppings,
    // pizzaId: 'pizza.id',
    //   },
    // );

    // .andWhere('ARRAY[...toppings] @> ARRAY[:...toppings]', { toppings })
    const pizza = await this.pizzaRepository.find({
      where: {
        price: Between(minPrice, maxPrice),

        // if no sizes were given, don't filter by size
        size: sizes ? In(sizes) : Raw('size'),
        // toppings: {
        // FIXME: Filtering by toppings, isn't working for now
        // Look into dealing with this with ArrayContainedBy or with Raw operators
        // if this doesn't work look into the possibility of using QuaryBuilder
        // Raw Postgres queries
        // or o it manually on the backend with Typescript
        // https://www.postgresql.org/docs/current/functions-array.html#ARRAY-OPERATORS-TABLE
        // https://stackoverflow.com/questions/11231544/check-if-value-exists-in-postgres-array
        // https://github.com/typeorm/typeorm/blob/master/docs/find-options.md
        // name: In(toppings),
        // },
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
      return names.every((name) => toppingsNames.includes(name));
    });
  }
}
