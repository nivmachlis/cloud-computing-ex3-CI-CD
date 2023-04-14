import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { NinjaApiException } from '../custom-exceptions/expection-types';

@Catch(NinjaApiException)
export class NinjaApiFilter implements ExceptionFilter {
  catch(exception: NinjaApiException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(504).json(-4);
  }
}
