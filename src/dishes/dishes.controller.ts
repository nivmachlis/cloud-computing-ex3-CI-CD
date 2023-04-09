import { Body, Controller, Get } from '@nestjs/common';
import { Dish } from './dto/dishes.dto';
import { DishesService } from './dishes.service';

@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}
  @Get()
  find() {
    console.log('A');
    return this.dishesService.getDish('brisket');
  }
}
