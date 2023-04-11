import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './pipe/validation.pipe';
import { BadRequestFilter } from './exception/bad-request.exception';
import { UnprocessableEntityFilter } from './exception/unprocessable-entity.exception';
import { ConflictFilter } from './exception/conflict.exception';
import { MethodNotAllowedFilter } from './exception/method-not-allowed.execption';
import { BadGatewayFilter } from './exception/bad-gateway.exception';
import { NotFoundFilter } from './exception/not-found.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalFilters(
    new BadRequestFilter(),
    new UnprocessableEntityFilter(),
    new ConflictFilter(),
    new MethodNotAllowedFilter(),
    new BadGatewayFilter(),
    new NotFoundFilter(),
  );

  await app.listen(8000);
}

bootstrap();
