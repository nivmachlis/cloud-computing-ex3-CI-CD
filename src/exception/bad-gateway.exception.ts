import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  BadGatewayException,
} from '@nestjs/common';

@Catch(BadGatewayException)
export class BadGatewayFilter implements ExceptionFilter {
  catch(exception: BadGatewayException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(504).json(-4);
  }
}
