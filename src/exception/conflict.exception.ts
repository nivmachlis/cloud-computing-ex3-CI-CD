import {
  Catch,
  ExceptionFilter,
  BadRequestException,
  ArgumentsHost,
  UnprocessableEntityException,
  ConflictException,
} from '@nestjs/common';

@Catch(ConflictException)
export class ConflictFilter implements ExceptionFilter {
  catch(exception: ConflictException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(422).json(-2);
  }
}
