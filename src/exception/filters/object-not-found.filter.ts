import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { ObjectNotFoundException } from '../custom-exceptions/expection-types';

@Catch(ObjectNotFoundException)
export class ObjectNotFoundFilter implements ExceptionFilter {
  catch(exception: ObjectNotFoundException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(404).json(-5);
  }
}
