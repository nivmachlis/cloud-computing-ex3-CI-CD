import {
  BadGatewayException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, lastValueFrom, map, tap } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { GetDishByNameDto } from './dto/GetDishByNameDto';
import { CreateDishDto } from './dto/CreateDishDto';
import { Dish } from './interfaces/dish.interface';
import { error } from 'console';

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
    const dish = Array.from(this.dishes.entries()).find(
      ([key, value]) => value.name === name,
    )[1];
    if (!dish) throw new NotFoundException();
    return dish;
  }

  getDishByID(id: number): Dish {
    const dish = this.dishes.get(id);
    if (!dish) throw new NotFoundException();
    return dish;
  }

  deleteDishByID(id: number): number {
    if (!this.dishes.delete(id)) throw new NotFoundException();
    return id;
  }

  deleteDishByName(name: string): number {
    const idToDelete = Array.from(this.dishes.entries()).find(
      ([key, value]) => value.name === name,
    )[0];
    if (!this.dishes.delete(idToDelete)) throw new NotFoundException();
    return idToDelete;
  }

  async create(getDishByNameDto: GetDishByNameDto): Promise<number> {
    if (
      Array.from(this.dishes.values()).some(
        (value) => value.name === getDishByNameDto.name,
      )
    ) {
      throw new ConflictException();
    }

    const { data, status } = await firstValueFrom(
      this.httpService.get(`${this.ninjaUrl}?query=${getDishByNameDto.name}`, {
        headers: this.headers,
      }),
    ).catch(() => {
      throw new BadGatewayException();
    });

    if (data.length === 0) {
      throw new MethodNotAllowedException();
    }
    if (status !== 200) {
      throw new BadGatewayException();
    }
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

    this.dishes.set(this.nextID, finalDish);
    this.nextID++;
    return finalDish.id;
  }
}
