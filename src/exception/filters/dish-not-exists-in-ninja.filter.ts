import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { DishNotExistsInNinjaApi } from '../custom-exceptions/expection-types';

@Catch(DishNotExistsInNinjaApi)
export class DishNotExistsInNinjaApiFilter implements ExceptionFilter {
  catch(exception: DishNotExistsInNinjaApi, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(422).json(-3);
  }
}
