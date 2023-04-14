import { HttpException, HttpStatus } from '@nestjs/common';

export class DishNotFoundForMealException extends HttpException {
  constructor() {
    super('Dish does not exists for meal', 422);
  }
}

export class ObjectNotFoundException extends HttpException {
  constructor() {
    super('Dish does not exists', 404);
  }
}

export class ObjectAlreadyExistsException extends HttpException {
  constructor() {
    super('Object already exists', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class NinjaApiException extends HttpException {
  constructor() {
    super('Ninja api error', 504);
  }
}

export class DishNotExistsInNinjaApi extends HttpException {
  constructor() {
    super('Dish Not exists in ninja api', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
