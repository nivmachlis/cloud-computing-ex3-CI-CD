import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { JsonParseException } from '../custom-exceptions/expection-types';

@Catch(JsonParseException)
export class JsonParseExceptionFilter implements ExceptionFilter {
  catch(exception: JsonParseException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(415).json(0);
  }
}
