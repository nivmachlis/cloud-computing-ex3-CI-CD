import { Module } from '@nestjs/common';
import { DisheshModule } from './dishes/dishes.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    DisheshModule,
    ConfigModule.forRoot({ isGlobal: true }),
    {
      module: HttpModule,
      global: true,
    },
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
