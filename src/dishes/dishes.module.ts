import { Module, forwardRef } from '@nestjs/common';
import { DishesController } from 'src/dishes/dishes.controller';
import { DishesService } from './dishes.service';

@Module({
  imports: [],
  controllers: [DishesController],
  providers: [DishesService],
  exports: [DishesService],
})
export class DisheshModule {}
