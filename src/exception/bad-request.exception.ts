import {
  Catch,
  ExceptionFilter,
  BadRequestException,
  ArgumentsHost,
} from '@nestjs/common';

@Catch(BadRequestException)
export class BadRequestFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(415).json(0);
  }
}
