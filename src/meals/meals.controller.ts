import {
  Body,
  Controller,
  Post,
  Query,
  Get,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  HttpException,
} from '@nestjs/common';
import { CreateMealDto } from './dto/create-meal.dto';
import { MealsService } from './meals.service';
import { Meal } from './interfaces/meal.interface';
import _ = require('lodash');
import { query } from 'express';

@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post()
  create(@Body() createMealDto: CreateMealDto, @Query() query): number {
    return this.mealsService.createMeal(createMealDto);
  }

  @Get()
  findAll(): Record<number, Meal> {
    return this.mealsService.getAllMeals();
  }
  @Get(':idOrName')
  findByIdOrName(@Param('idOrName') idOrName: string): Meal {
    if (!_.isNaN(_.toNumber(idOrName))) {
      const id = _.toNumber(idOrName);
      return this.mealsService.getMealByID(id);
    } else {
      const name = idOrName;
      return this.mealsService.getMealByName(name);
    }
  }

  @Delete(':idOrName')
  deleteByIdOrName(@Param('idOrName') idOrName: string): number {
    if (!_.isNaN(_.toNumber(idOrName))) {
      const id = _.toNumber(idOrName);
      return this.mealsService.deleteMealByID(id);
    } else {
      const name = idOrName;
      return this.mealsService.deleteMealByName(name);
    }
  }
  @Delete()
  deleteAll(): Error {
    throw new HttpException(
      'This method is not allowed for the requested URL',
      405,
    );
  }

  @Put(':id')
  update(
    @Body() createMealDto: CreateMealDto,
    @Query() query,
    @Param('id', ParseIntPipe) id: number,
  ): number {
    return this.mealsService.updateMeal(createMealDto);
  }
}
