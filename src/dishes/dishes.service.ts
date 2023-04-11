import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, lastValueFrom, map, tap } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { GetDishByNameDto } from './dto/GetDishByNameDto';
import { CreateDishDto } from './dto/CreateDishDto';
import { Dish } from './interfaces/dish.interface';

@Injectable()
export class DishesService {
  headers: object;
  ninjaUrl: string;
  dishes: Map<number, Dish> = new Map();
  private nextID: number = 1;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
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
    return Array.from(this.dishes.entries()).find(
      ([key, value]) => value.name === name,
    )[1];
  }

  getDishByID(id: number): Dish {
    return this.dishes.get(id);
  }

  deleteDishByID(id: number): number {
    this.dishes.delete(id);
    return id;
  }

  deleteDishByName(name: string): number {
    const idToDelete = Array.from(this.dishes.entries()).find(
      ([key, value]) => value.name === name,
    )[0];
      this.dishes.delete(idToDelete)
      return idToDelete
  }

  async create(getDishByNameDto: GetDishByNameDto): Promise<number> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          `${this.ninjaUrl}?query=${getDishByNameDto.name}`,
          {
            headers: this.headers,
          },
        ),
      );
      const mappedDish: Dish[] = data.map((dish): Dish => {
        return {
          name: dish.name,
          id: 1,
          cal: dish.calories,
          size: dish.serving_size_g,
          sodium: dish.sodium_mg,
          sugar: dish.sugar_g,
        };
      });
      const finalDish: Dish = mappedDish.reduce((accumulator, currentDish) => {
        return {
          name: accumulator.name + ' and ' + currentDish.name,
          id: this.nextID,
          cal: accumulator.cal + currentDish.cal,
          size: accumulator.size + currentDish.size,
          sodium: accumulator.sodium + currentDish.sodium,
          sugar: accumulator.sugar + currentDish.sugar,
        };
      });
      console.log(finalDish);
      this.dishes.set(this.nextID, finalDish);
      this.nextID++;
      return finalDish.id;
    } catch (error) {
      console.log(error);
    }
  }
}
