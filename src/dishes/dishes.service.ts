import { Injectable, Scope } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { CreateDishDto } from './dto/CreateDishDto';
import { Dish } from './interfaces/dish.interface';
import {
  DishNotExistsInNinjaApi,
  ObjectNotFoundException,
  NinjaApiException,
  ObjectAlreadyExistsException,
} from 'src/exception/custom-exceptions/expection-types';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { promises } from 'dns';
import { EVENT } from 'src/events/events';
import { head } from 'lodash';

@Injectable({ scope: Scope.DEFAULT })
export class DishesService {
  headers: object;
  ninjaUrl: string;
  dishes: Map<number, Dish> = new Map();
  private nextID: number = 1;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    const headers = {
      'X-Api-Key': this.configService.get('NINJA_API_KEY'),
    };
    this.headers = headers;
    this.ninjaUrl = this.configService.get('NINJAS_URL');
  }

  getAllDishes(): Record<number, Dish> {
    return Object.fromEntries(this.dishes);
  }

  getDishByName(name: string): Dish {
    const dish = Array.from(this.dishes.values()).find(
      (dish) => dish.name === name,
    );
    if (!dish) {
      throw new ObjectNotFoundException();
    }
    return dish;
  }

  getDishByID(id: number): Dish {
    const dish = this.dishes.get(id);
    if (!dish) throw new ObjectNotFoundException();
    return dish;
  }

  async deleteDishByID(id: number): Promise<number> {
    const dishToDelete: Dish = this.getDishByID(id);
    this.dishes.delete(id);
    await this.eventEmitter.emitAsync(EVENT.DISH_DELETED, dishToDelete);
    return id;
  }

  async deleteDishByName(name: string): Promise<number> {
    const dishToDelete = this.getDishByName(name);
    const idToDelete = dishToDelete.ID;
    this.dishes.delete(idToDelete);
    await this.eventEmitter.emitAsync(EVENT.DISH_DELETED, dishToDelete);

    return idToDelete;
  }

  async create(getDishByNameDto: CreateDishDto): Promise<number> {
    if (
      Array.from(this.dishes.values()).some(
        (value) => value.name === getDishByNameDto.name,
      )
    ) {
      throw new ObjectAlreadyExistsException();
    }

    const { data, status } = await firstValueFrom(
      this.httpService.get(`${this.ninjaUrl}?query=${getDishByNameDto.name}`, {
        headers: this.headers,
      }),
    ).catch((error) => {
      throw new NinjaApiException();
    });

    if (data.length === 0) {
      throw new DishNotExistsInNinjaApi();
    }
    if (status !== 200) {
      throw new NinjaApiException();
    }
    const mappedDish: Dish[] = data.map((dish): Dish => {
      return {
        name: dish.name,
        ID: this.nextID,
        cal: dish.calories,
        size: dish.serving_size_g,
        sodium: dish.sodium_mg,
        sugar: dish.sugar_g,
      };
    });
    const finalDish: Dish = mappedDish.reduce((accumulator, currentDish) => {
      return {
        name: accumulator.name + ' and ' + currentDish.name,
        ID: this.nextID,
        cal: accumulator.cal + currentDish.cal,
        size: accumulator.size + currentDish.size,
        sodium: accumulator.sodium + currentDish.sodium,
        sugar: accumulator.sugar + currentDish.sugar,
      };
    });

    this.dishes.set(this.nextID, finalDish);
    this.nextID++;
    return finalDish.ID;
  }

  getDishForEventHandlerById(id: number): Dish {
    const dish = this.dishes.get(id);
    if (!dish) return null;
    return dish;
  }
}
