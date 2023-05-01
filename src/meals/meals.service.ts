import { Injectable } from '@nestjs/common';
import { DishesService } from 'src/dishes/dishes.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { Meal } from './interfaces/meal.interface';
import {
  DishNotFoundForMealException,
  ObjectAlreadyExistsException,
  ObjectNotFoundException,
} from '../exception/custom-exceptions/expection-types';
import { OnEvent } from '@nestjs/event-emitter';
import { Dish } from 'src/dishes/interfaces/dish.interface';
import { EVENT } from 'src/events/events';
@Injectable()
export class MealsService {
  meals: Map<number, Meal> = new Map();
  private nextID: number = 1;
  constructor(private readonly dishService: DishesService) {}
  createMeal(createMealDto: CreateMealDto) {
    if (
      Array.from(this.meals.values()).some(
        (value) => value.name === createMealDto.name,
      )
    ) {
      throw new ObjectAlreadyExistsException();
    }
    const meal: Meal = this.createMealObject(createMealDto, this.nextID);
    this.meals.set(this.nextID, meal);
    this.nextID++;
    return meal.ID;
  }

  getMealByName(name: string): Meal {
    const meal = Array.from(this.meals.values()).find(
      (meal) => meal.name === name,
    );
    if (!meal) throw new ObjectNotFoundException();
    return meal;
  }
  getMealByID(id: number): Meal {
    const meal = this.meals.get(id);
    if (!meal) throw new ObjectNotFoundException();
    return meal;
  }
  getAllMeals(): Record<number, Meal> {
    return Object.fromEntries(this.meals);
  }

  deleteMealByName(name: string): number {
    const mealToDelete = this.getMealByName(name);
    const idToDelete = mealToDelete.ID;
    this.meals.delete(idToDelete);
    return idToDelete;
  }
  deleteMealByID(id: number): number {
    if (!this.meals.delete(id)) throw new ObjectNotFoundException();
    return id;
  }

  updateMeal(createMealDto: CreateMealDto): number {
    const mealToUpdate = this.getMealByName(createMealDto.name);
    const meal: Meal = this.createMealObject(createMealDto, mealToUpdate.ID);
    this.meals.set(mealToUpdate.ID, meal);
    return meal.ID;
  }

  private createMealObject(createMealDto: CreateMealDto, id: number): Meal {
    let appetizer, main, dessert;
    try {
      appetizer = this.dishService.getDishByID(createMealDto.appetizer);
      main = this.dishService.getDishByID(createMealDto.main);
      dessert = this.dishService.getDishByID(createMealDto.dessert);
    } catch (error) {
      throw new DishNotFoundForMealException();
    }
    const meal: Meal = {
      name: createMealDto.name,
      ID: id,
      appetizer: createMealDto.appetizer,
      main: createMealDto.main,
      dessert: createMealDto.dessert,
      cal: appetizer.cal + main.cal + dessert.cal,
      sodium: appetizer.sodium + main.sodium + dessert.sodium,
      sugar: appetizer.sugar + main.sugar + dessert.sugar,
    };
    return meal;
  }
  private calcNutrionValues(meal: Meal) {
    const appetizer = this.dishService.getDishForEventHandlerById(
      meal.appetizer,
    );
    const main = this.dishService.getDishForEventHandlerById(meal.main);
    const dessert = this.dishService.getDishForEventHandlerById(meal.dessert);
    meal.cal = (appetizer?.cal || 0) + (dessert?.cal || 0) + (main?.cal || 0);
    meal.sodium =
      (appetizer?.sodium || 0) + (dessert?.sodium || 0) + (main?.sodium || 0);
    meal.sugar =
      (appetizer?.sugar || 0) + (dessert?.sugar || 0) + (main?.sugar || 0);
  }

  @OnEvent(EVENT.DISH_DELETED)
  async handleDishDeleted(deletedDish: Dish) {
    // handle and process "OrderCreatedEvent" event
    this.meals.forEach((value) => {
      if (value.appetizer === deletedDish.ID) {
        value.appetizer = null;
        this.calcNutrionValues(value);
      }
      if (value.main === deletedDish.ID) {
        value.main = null;
        this.calcNutrionValues(value);
      }
      if (value.dessert === deletedDish.ID) {
        value.dessert = null;
        this.calcNutrionValues(value);
      }
    });
  }
}
