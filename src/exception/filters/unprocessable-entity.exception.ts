import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  UnprocessableEntityException,
} from '@nestjs/common';

@Catch(UnprocessableEntityException)
export class UnprocessableEntityFilter implements ExceptionFilter {
  catch(exception: UnprocessableEntityException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(422).json(-1);
  }
}
