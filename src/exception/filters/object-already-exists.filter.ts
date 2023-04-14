import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { ObjectAlreadyExistsException } from '../custom-exceptions/expection-types';

@Catch(ObjectAlreadyExistsException)
export class ObjectAlreadyExsitsFilter implements ExceptionFilter {
  catch(exception: ObjectAlreadyExistsException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(422).json(-2);
  }
}
