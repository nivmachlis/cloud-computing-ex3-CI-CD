import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './pipe/validation.pipe';
import { BadRequestFilter } from './exception/filters/bad-request.filter';
import { UnprocessableEntityFilter } from './exception/filters/unprocessable-entity.exception';
import { ObjectAlreadyExsitsFilter } from './exception/filters/object-already-exists.filter';
import { DishNotExistsInNinjaApiFilter } from './exception/filters/dish-not-exists-in-ninja.filter';
import { NinjaApiFilter } from './exception/filters/ninja-api.filter';
import { ObjectNotFoundFilter } from './exception/filters/object-not-found.filter';
import { DishNotFoundForMealFilter } from './exception/filters/dish-not-found-for-meal.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { jsonMiddleware } from "./middleware/json-only.middleware'";
import { JsonParseExceptionFilter } from './exception/filters/json-parse-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Cloud Computing and SE Ex1')
    .setDescription('API Description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalFilters(
    //pipes filters
    new BadRequestFilter(),
    new UnprocessableEntityFilter(),
    //pipes filters

    //custom filters
    new ObjectAlreadyExsitsFilter(),
    new DishNotExistsInNinjaApiFilter(),
    new NinjaApiFilter(),
    new ObjectNotFoundFilter(),
    new DishNotFoundForMealFilter(),
    new JsonParseExceptionFilter(),
    //custom filters
  );
  app.use(jsonMiddleware);
  await app.listen(8000, '0.0.0.0');
}

bootstrap();
