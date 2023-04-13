import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { isNotEmpty, validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { error } from 'console';
import { query } from 'express';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype, type }: ArgumentMetadata) {
    console.log(type, value);
    if (type === 'query' && value.query) {
      throw new BadRequestException();
    }
    if (type === 'param') {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      if (errors.some((error) => error.property === 'name'))
        throw new UnprocessableEntityException();

      throw new BadRequestException();
    }
    return value;
  }
}
