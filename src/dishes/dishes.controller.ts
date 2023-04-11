import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { DishesService } from './dishes.service';
import { GetDishByNameDto } from './dto/GetDishByNameDto';
import { CreateDishDto } from './dto/CreateDishDto';
import { Dish } from './interfaces/dish.interface';

@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Get()
  findAll(): Record<number, Dish> {
    return this.dishesService.getAllDishes();
  }
  @Get(':id')
  findByID(@Param('get-dish-by-id:id', ParseIntPipe) id: number): Dish {
    return this.dishesService.getDishByID(id);
  }

  @Get('get-dish-by-name/:name')
  findByName(@Param('name', ValidationPipe) name: string): Dish {
    return this.dishesService.getDishByName(name);
  }

  @Post()
  async create(@Body() getDishByNameDto: GetDishByNameDto): Promise<number> {
    return await this.dishesService.create(getDishByNameDto);
  }

  @Delete()
  deleteByID(@Param('delete-dish-by-id', ParseIntPipe) id: number): number {
    return this.dishesService.deleteDishByID(id);
  }

  @Delete('delete-dish-by-name/:name')
  deleteByName(@Param('name', ValidationPipe) name: string): number {
    return this.dishesService.deleteDishByName(name);
  }
}
