import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype, type }: ArgumentMetadata) {
    if (type === 'query' && value.query) {
      throw new BadRequestException();
    }
    if (type === 'param') {
      return value;
    }
    console.log(metatype, value, type);
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      if (
        errors.some((error) =>
          ['name', 'appetizer', 'main', 'dessert'].includes(error.property),
        )
      ) {
        throw new UnprocessableEntityException();
      }

      throw new BadRequestException();
    }
    return value;
  }
}
