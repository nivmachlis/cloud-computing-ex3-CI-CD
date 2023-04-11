import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { DishesService } from './dishes.service';
import { GetDishByNameDto } from './dto/GetDishByNameDto';
import { Dish } from './interfaces/dish.interface';

@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Get()
  findAll(): Record<number, Dish> {
    return this.dishesService.getAllDishes();
  }
  @Get('get-dish-by-id/:id')
  findByID(@Param('id', ParseIntPipe) id: number): Dish {
    return this.dishesService.getDishByID(id);
  }

  @Get('get-dish-by-name/name')
  findByName(@Param('name', ValidationPipe) name: string): Dish {
    return this.dishesService.getDishByName(name);
  }

  @Post()
  async create(
    @Body() getDishByNameDto: GetDishByNameDto,
    @Query() query,
  ): Promise<number> {
    return await this.dishesService.create(getDishByNameDto);
  }

  @Delete('delete-dish-by-id/:id')
  deleteByID(@Param('id', ParseIntPipe) id: number): number {
    return this.dishesService.deleteDishByID(id);
  }

  @Delete('delete-dish-by-name/:name')
  deleteByName(@Param('name', ValidationPipe) name: string): number {
    return this.dishesService.deleteDishByName(name);
  }
}
