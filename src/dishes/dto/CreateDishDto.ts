import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDishDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}
