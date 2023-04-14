import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { DishNotFoundForMealException } from '../custom-exceptions/expection-types';

@Catch(DishNotFoundForMealException)
export class DishNotFoundForMealFilter implements ExceptionFilter {
  catch(exception: DishNotFoundForMealException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(422).json(-6);
  }
}
