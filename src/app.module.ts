import { Module } from '@nestjs/common';
import { DisheshModule } from './dishes/dishes.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { MealsModule } from './meals/meals.module';
@Module({
  imports: [
    DisheshModule,
    ConfigModule.forRoot({ isGlobal: true }),
    {
      module: HttpModule,
      global: true,
    },
    MealsModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
