import { Module } from '@nestjs/common';
import { DisheshModule } from './dishes/dishes.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { MealsModule } from './meals/meals.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { config } from './configuration';

@Module({
  imports: [
    DisheshModule,
    MealsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    EventEmitterModule.forRoot({ global: true }),
    {
      module: HttpModule,
      global: true,
    },
  ],
})
export class AppModule {}
