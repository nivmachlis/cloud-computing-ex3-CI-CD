import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  MethodNotAllowedException,
} from '@nestjs/common';

@Catch(MethodNotAllowedException)
export class MethodNotAllowedFilter implements ExceptionFilter {
  catch(exception: MethodNotAllowedException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(422).json(-3);
  }
}
