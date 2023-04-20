import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { DishesService } from './dishes.service';
import { CreateDishDto } from './dto/CreateDishDto';
import { Dish } from './interfaces/dish.interface';
import _ = require('lodash');
@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Get()
  findAll(): Record<string, Dish> {
    return this.dishesService.getAllDishes();
  }
  @Get(':idOrName')
  findByIdOrName(@Param('idOrName') idOrName: string): Dish {
    if (!_.isNaN(_.toNumber(idOrName))) {
      const id = _.toNumber(idOrName);
      return this.dishesService.getDishByID(id);
    } else {
      const name = idOrName;
      return this.dishesService.getDishByName(name);
    }
  }

  @Post()
  async create(
    @Body() getDishByNameDto: CreateDishDto,
    @Query() query,
  ): Promise<number> {
    return await this.dishesService.create(getDishByNameDto);
  }

  @Delete(':idOrName')
  async deleteByIdOrName(@Param('idOrName') idOrName: string): Promise<number> {
    if (!_.isNaN(_.toNumber(idOrName))) {
      const id = _.toNumber(idOrName);
      return this.dishesService.deleteDishByID(id);
    } else {
      const name = idOrName;
      return await this.dishesService.deleteDishByName(name);
    }
  }
  @Delete()
  deleteAll(): Error {
    throw new HttpException(
      'This method is not allowed for the requested URL',
      405,
    );
  }
}
