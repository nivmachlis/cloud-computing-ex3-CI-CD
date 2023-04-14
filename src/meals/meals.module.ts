import { Module, forwardRef } from '@nestjs/common';
import { MealsController } from './meals.controller';
import { MealsService } from './meals.service';
import { DisheshModule } from 'src/dishes/dishes.module';

@Module({
  imports: [DisheshModule],
  controllers: [MealsController],
  providers: [MealsService],
  exports: [],
})
export class MealsModule {}
